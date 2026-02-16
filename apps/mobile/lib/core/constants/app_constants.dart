class AppConstants {
  static const String appName = 'Portaria SaaS';
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL', defaultValue: 'https://accynhzkryldezkzmury.supabase.co');
  static const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY3luaHprcnlsZGV6a3ptdXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDk3NDQsImV4cCI6MjA4NjYyNTc0NH0.AWtMyxPKFQxGwJdOTVNWH3Narh5NwCJQ8t4E06LqycA');
}
