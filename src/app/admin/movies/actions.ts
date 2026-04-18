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

    const mappedMovies = tmdbMovies.map((m: any) => ({
      title: m.title,
      description: m.overview,
      poster_url: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      trailer_url: '', // Có thể fetch sau nếu cần
      duration_mins: 120, // Default for now
      release_date: m.release_date || null,
      rating: m.vote_average || 0
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
  } catch (err: any) {
    return { success: false, message: err.message }
  }
}

export async function deleteAllMovies() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@nthera.vn') return { success: false }

  const { error } = await supabase.from('movies').delete().filter('id', 'not.is', null) // Trick to delete all
  revalidatePath('/admin/movies')
  revalidatePath('/')
  
  return { success: !error }
}
