import SwiftUI

@main
struct CupboardCompanionApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}

private struct RootView: View {
    private let appURL = URL(string: "https://cosmicbubblegumgirl.github.io/vercel-apps-github-pages/cupboard-companion/")!
    @State private var showLaunch = true

    var body: some View {
        ZStack {
            CompanionWebView(url: appURL)
                .ignoresSafeArea()

            if showLaunch {
                LaunchView()
                    .transition(.opacity)
            }
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.4) {
                withAnimation(.easeOut(duration: 0.35)) {
                    showLaunch = false
                }
            }
        }
    }
}
