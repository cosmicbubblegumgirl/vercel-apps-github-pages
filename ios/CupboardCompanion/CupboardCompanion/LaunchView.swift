import SwiftUI

struct LaunchView: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.08, green: 0.25, blue: 0.23),
                    Color(red: 0.19, green: 0.44, blue: 0.59),
                    Color(red: 0.18, green: 0.54, blue: 0.37)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 22) {
                ZStack {
                    RoundedRectangle(cornerRadius: 34)
                        .fill(Color(red: 1.0, green: 0.97, blue: 0.87))
                        .frame(width: 154, height: 154)
                        .shadow(color: .black.opacity(0.18), radius: 24, x: 0, y: 16)

                    HStack(spacing: 8) {
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(red: 0.88, green: 0.65, blue: 0.16))
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(red: 0.88, green: 0.65, blue: 0.16))
                    }
                    .frame(width: 110, height: 114)

                    Circle()
                        .fill(Color(red: 0.89, green: 0.96, blue: 1.0))
                        .frame(width: 74, height: 74)

                    Image(systemName: "sparkle")
                        .font(.system(size: 34, weight: .heavy))
                        .foregroundStyle(Color(red: 0.89, green: 0.38, blue: 0.31))
                }

                VStack(spacing: 8) {
                    Text("Cupboard Companion")
                        .font(.system(size: 30, weight: .black, design: .rounded))
                    Text("A Quantumcupcake creation")
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .opacity(0.78)
                }
                .foregroundStyle(.white)
            }
            .padding()
        }
    }
}
