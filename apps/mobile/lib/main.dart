import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: CampusGistApp()));
}

class CampusGistApp extends StatelessWidget {
  const CampusGistApp({super.key});

  @override
  Widget build(BuildContext context) {
    const ink = Color(0xFF101D2A);
    const lime = Color(0xFFB9F36B);
    return MaterialApp(
      title: 'Campus Gist',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: lime, brightness: Brightness.light),
        scaffoldBackgroundColor: const Color(0xFFF6F8F5),
        useMaterial3: true,
        fontFamily: 'Roboto',
        appBarTheme: const AppBarTheme(backgroundColor: Color(0xFFF6F8F5), foregroundColor: ink),
      ),
      home: const CampusHomePage(),
    );
  }
}

class CampusHomePage extends StatelessWidget {
  const CampusHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [
          CircleAvatar(backgroundColor: Color(0xFFB9F36B), child: Text('CG', style: TextStyle(color: Color(0xFF101D2A), fontWeight: FontWeight.w800))),
          SizedBox(width: 10),
          Text('CAMPUS GIST', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
        ]),
        actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none_rounded))],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const SizedBox(height: 14),
          const Text('YOUR CAMPUS, CONNECTED.', style: TextStyle(fontSize: 11, letterSpacing: 2, color: Color(0xFF71806D), fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          const Text('Everything campus.\nOne platform.', style: TextStyle(fontSize: 34, height: 1.12, fontWeight: FontWeight.w800, color: Color(0xFF101D2A))),
          const SizedBox(height: 12),
          const Text('The latest gist, important updates and campus services — all in one place.', style: TextStyle(color: Color(0xFF667584), height: 1.6)),
          const SizedBox(height: 26),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(color: const Color(0xFF101D2A), borderRadius: BorderRadius.circular(20)),
            child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('CAMPUS POWER UPDATE', style: TextStyle(color: Color(0xFFB9F36B), fontSize: 10, letterSpacing: 1.5, fontWeight: FontWeight.w700)),
              SizedBox(height: 10),
              Text('Stay updated on electricity around your hostel.', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
              SizedBox(height: 8),
              Text('Live hostel reports will appear here.', style: TextStyle(color: Color(0xFFB7C1C8), fontSize: 12)),
            ]),
          ),
          const SizedBox(height: 26),
          const Text('EXPLORE CAMPUS', style: TextStyle(fontSize: 11, letterSpacing: 1.5, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          for (final item in const [
            (Icons.newspaper_rounded, 'Campus Gist', 'News, announcements and stories'),
            (Icons.groups_rounded, 'Community', 'Connect with students'),
            (Icons.home_work_rounded, 'Accommodation', 'Find a place around campus'),
            (Icons.map_outlined, 'Campus map', 'Discover places and facilities'),
          ])
            Card(
              elevation: 0,
              color: Colors.white,
              child: ListTile(
                leading: Icon(item.$1, color: const Color(0xFF718F50)),
                title: Text(item.$2, style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text(item.$3),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {},
              ),
            ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.dynamic_feed_outlined), label: 'Gist'),
          NavigationDestination(icon: Icon(Icons.explore_outlined), label: 'Explore'),
          NavigationDestination(icon: Icon(Icons.grid_view_rounded), label: 'Services'),
          NavigationDestination(icon: Icon(Icons.person_outline_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}
