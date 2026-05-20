import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mauydaywmlgbraxbsnid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdXlkYXl3bWxnYnJheGJzbmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MTY4ODEsImV4cCI6MjA5MjA5Mjg4MX0.0vUCTuBHL9q8LDxyxUdbuQREj6X2FCm_zaWtVnFIrXM'
);

async function testInsert() {
  const { data: movies } = await supabase.from('movies').select('id').limit(1);
  const { data: rooms } = await supabase.from('rooms').select('id').limit(1);

  if (!movies?.length || !rooms?.length) {
    console.error('No movies or rooms found');
    return;
  }

  const movie_id = movies[0].id;
  const room_id = rooms[0].id;
  const start_time = '2026-05-19T14:23';
  const base_price = 70000;

  const { data, error } = await supabase
    .from('showtimes')
    .insert([{ movie_id, room_id, start_time, base_price }]);

  console.log('Error:', error);
  console.log('Data:', data);
}

testInsert();
