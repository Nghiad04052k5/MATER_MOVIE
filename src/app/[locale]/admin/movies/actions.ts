'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function syncTMDBMovies() {
  const supabase = await createClient()

  // Kiểm tra quyền Admin (Security check in Server Action)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@nthera.vn') {
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=vi-VN&page=1`
    )
    
    if (!res.ok) throw new Error('Failed to fetch TMDB API')
    
    const data = await res.json()
    const tmdbMovies = data.results || []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedMovies = await Promise.all(tmdbMovies.map(async (m: any) => {
      let trailer_url = '';
      try {
        const vidRes = await fetch(`https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${process.env.TMDB_API_KEY}`)
        if (vidRes.ok) {
          const vidData = await vidRes.json()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const trailer = vidData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
          if (trailer) trailer_url = `https://www.youtube.com/watch?v=${trailer.key}`
        }
      } catch (e) {
        console.error('Không thể fetch trailer cho phim', m.title, e)
      }

      return {
        title: m.title,
        description: m.overview,
        poster_url: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        trailer_url: trailer_url,
        duration_mins: 120, // Default for now
        release_date: m.release_date || null,
        rating: m.vote_average || 0
      }
    }))

    // Do Supabase insert (Cần thiết lập RLS trong DB nhưng hiện chạy quyền Admin thì không sao)
    // Nếu trùng tên phim thì tốt nhất nên kiểm tra, ở đây ta cứ insert thẳng
    const { error } = await supabase
      .from('movies')
      .insert(mappedMovies)
      // Note: Nếu muốn xịn hơn thì Upsert dựa trên title, nhưng Insert cơ bản là đủ test.

    if (error) {
      console.error(error)
      return { success: false, message: 'Lỗi khi lưu vào Database: ' + error.message }
    }

    revalidatePath('/admin/movies')
    revalidatePath('/')
    
    return { success: true, count: mappedMovies.length }
  } catch (err: unknown) {
    return { success: false, message: (err as Error).message }
  }
}

export async function deleteAllMovies() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@nthera.vn') return { success: false, message: 'Unauthorized' }

  // Để xoá được Movies mà không bị lỗi Khoá ngoại (Foreign Key), cần xoá các bảng phụ thuộc trước
  await supabase.from('ticket_seats').delete().not('ticket_id', 'is', null)
  await supabase.from('tickets').delete().not('id', 'is', null)
  await supabase.from('showtimes').delete().not('id', 'is', null)

  const { error } = await supabase.from('movies').delete().not('id', 'is', null)
  
  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/movies')
  revalidatePath('/admin/showtimes')
  revalidatePath('/')
  
  return { success: true }
}
