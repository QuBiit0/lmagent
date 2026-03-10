const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',           // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'messages',
      filter: 'room_id=eq.123',
    },
    (payload) => {
      console.log('Change:', payload);
      // payload.eventType, payload.new, payload.old
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();