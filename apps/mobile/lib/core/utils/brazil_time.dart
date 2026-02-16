/// Utility to get Brazil time regardless of device timezone configuration
/// 
/// This solves the issue where the device shows correct time but reports
/// wrong timezone from the mobile network.
class BrazilTime {
  /// Brazil timezone offset: UTC-3 (or UTC-2 during daylight saving time)
  /// For simplicity, we use UTC-3 as Brazil no longer observes DST since 2019
  static const Duration brazilOffset = Duration(hours: -3);
  
  /// Gets the current time in correct UTC for the database
  /// 
  /// Logic:
  /// 1. We assume the user sees the CORRECT time on the device screen (e.g. 20:50).
  /// 2. We assume this time represents Brazil Time (UTC-3).
  /// 3. To get UTC, we simply take the components (20:50) and add 3 hours (23:50).
  /// 
  /// This bypasses any incorrect timezone offsets the device might have from the network.
  static DateTime now() {
    final deviceNow = DateTime.now();
    
    // Create a UTC DateTime with the exact same numbers shown on screen
    final baseUtc = DateTime.utc(
      deviceNow.year, 
      deviceNow.month, 
      deviceNow.day, 
      deviceNow.hour, 
      deviceNow.minute, 
      deviceNow.second, 
      deviceNow.millisecond
    );
    
    // Add 3 hours to convert "Brazil" -> UTC
    return baseUtc.add(const Duration(hours: 3));
  }
  
  /// Gets the current time in UTC (for saving to database)
  static DateTime nowUtc() {
    return now().toUtc();
  }
}
