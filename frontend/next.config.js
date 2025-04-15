/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['example.com'], // 이미지 도메인 설정
  },
  
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080/api',
  },
  
  webpack: (config, { isServer, dev }) => {
    // AudioWorklet과 WebWorker 지원을 위한 설정
    if (!isServer) {
      config.output.globalObject = 'self';
    }
    
    // Tone.js 워크렛 파일을 처리하기 위한 특별 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      'tone/build/esm/': 'tone/build/Tone/', // ESM 대신 UMD 버전 사용
    };

    // AudioWorklet 처리를 위한 설정 - Next.js 13+ 호환
    config.module.rules.push({
      test: /\.worklet\.js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      }
    });

    // WebWorker 처리를 위한 설정 - Next.js 13+ 호환
    config.module.rules.push({
      test: /\.worker\.js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      }
    });
    
    // .worklet 확장자를 가진 파일에 대한 추가 설정
    config.module.rules.push({
      test: /\.(worklet|js)$/,
      include: /node_modules\/tone/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
          publicPath: '/_next/',
          emitFile: !isServer,
        },
      },
    });

    return config;
  },
  
  // 개발 환경에서만 TypeScript 빌드 오류 무시
  typescript: {
    // 개발 환경에서만 빌드 오류를 무시하고, 프로덕션에서는 엄격하게 적용
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // 외부 웹 오디오 리소스를 위한 보안 헤더 설정
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;