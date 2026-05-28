pipeline {
    agent any

    environment {
        CARGO_TERM_COLOR = 'always'
        RUST_BACKTRACE = '1'
        GITHUB_REPO = 'ziriuz84/asteroid_app'
        SONAR_HOST_URL = 'https://sq.casapomininegri.it'
        SONAR_SCANNER_VERSION = '6.2.1.4610'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git fetch origin --tags --force'
            }
        }

        stage('Detect Release Tag') {
            steps {
                script {
                    def tag = sh(
                        script: "git tag --points-at HEAD --list 'v[0-9]*.[0-9]*.[0-9]*' | sort -V | tail -n 1",
                        returnStdout: true
                    ).trim()
                    if (tag) {
                        env.RELEASE_TAG = tag
                        echo "Release tag on HEAD: ${tag}"
                    } else {
                        env.RELEASE_TAG = ''
                        echo 'No release tag on HEAD; skipping release stages'
                    }
                }
            }
        }

        stage('Setup Node') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Setup Rust') {
            steps {
                sh '''
                    rustup default stable
                    rustup component add clippy llvm-tools-preview
                    cargo install cargo-tarpaulin --locked
                '''
            }
        }

        stage('Setup Linux deps') {
            steps {
                sh '''
                    sudo apt-get update
                    sudo apt-get install -y \
                        libwebkit2gtk-4.1-dev \
                        libayatana-appindicator3-dev \
                        librsvg2-dev \
                        patchelf \
                        build-essential \
                        libssl-dev
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'cd src-tauri && cargo test --verbose --all-features'
            }
        }

        stage('Coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh 'cd src-tauri && cargo tarpaulin --verbose --all-features --out Lcov --output-dir ..'
                }
            }
        }

        stage('Build Linux') {
            steps {
                sh 'npm run tauri build'
            }
        }

        // Informational only: SonarQube never fails the build (findings or scanner errors).
        stage('SonarQube Analysis') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE', message: 'SonarQube analysis failed (non-blocking)') {
                    withCredentials([
                        string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''#!/usr/bin/env bash
                            set -euo pipefail

                            ensure_sonar_scanner() {
                                if command -v sonar-scanner >/dev/null 2>&1; then
                                    return 0
                                fi
                                local scanner_zip="/tmp/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip"
                                local scanner_dir="/tmp/sonar-scanner-${SONAR_SCANNER_VERSION}-linux-x64"
                                echo "Downloading SonarScanner ${SONAR_SCANNER_VERSION}..."
                                curl -fsSL \
                                    "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip" \
                                    -o "${scanner_zip}"
                                rm -rf "${scanner_dir}"
                                unzip -q "${scanner_zip}" -d /tmp
                                export PATH="${scanner_dir}/bin:${PATH}"
                            }

                            ensure_sonar_scanner

                            sonar-scanner \
                                -Dsonar.host.url="${SONAR_HOST_URL}" \
                                -Dsonar.token="${SONAR_TOKEN}" \
                                -Dsonar.projectVersion="${GIT_COMMIT:-unknown}" \
                                -Dsonar.qualitygate.wait=false
                        '''
                    }
                }
            }
        }
        // stage('Quality Gate') {
        //     steps {
        //         timeout(time: 5, unit: 'MINUTES') {
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }

        stage('Validate Release') {
            when {
                expression { env.RELEASE_TAG ==~ /^v\d+\.\d+\.\d+$/ }
            }
            steps {
                sh '''#!/usr/bin/env bash
                    set -euo pipefail
                    PKG_VER=$(node -p "require('./package.json').version")
                    TAG_VER="${RELEASE_TAG#v}"
                    TAURI_VER=$(node -p "require('./src-tauri/tauri.conf.json').version")
                    if [ "$PKG_VER" != "$TAG_VER" ]; then
                        echo "package.json version ($PKG_VER) does not match tag ($TAG_VER)"
                        exit 1
                    fi
                    if [ "$TAURI_VER" != "$TAG_VER" ]; then
                        echo "tauri.conf.json version ($TAURI_VER) does not match tag ($TAG_VER)"
                        exit 1
                    fi
                '''
            }
        }

        stage('Package Release') {
            when {
                expression { env.RELEASE_TAG ==~ /^v\d+\.\d+\.\d+$/ }
            }
            steps {
                sh '''#!/usr/bin/env bash
                    set -euo pipefail
                    VERSION="${RELEASE_TAG#v}"
                    ARCH="x86_64-unknown-linux-gnu"
                    mkdir -p dist

                    cp src-tauri/target/release/bundle/deb/*.deb dist/
                    cp src-tauri/target/release/bundle/appimage/*.AppImage dist/

                    PACKAGE_DIR="dist/asteroid_app-${VERSION}-${ARCH}"
                    mkdir -p "${PACKAGE_DIR}"
                    cp src-tauri/target/release/asteroid_app "${PACKAGE_DIR}/"
                    cp README.md LICENSE "${PACKAGE_DIR}/"
                    tar -czf "dist/asteroid_app-${VERSION}-${ARCH}.tar.gz" -C dist "asteroid_app-${VERSION}-${ARCH}"

                    sha256sum dist/*.deb dist/*.AppImage dist/*.tar.gz > dist/SHA256SUMS
                '''
                archiveArtifacts artifacts: 'dist/*', fingerprint: true
            }
        }

        stage('GitHub Release') {
            when {
                expression { env.RELEASE_TAG ==~ /^v\d+\.\d+\.\d+$/ }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GH_TOKEN'
                )]) {
                    sh '''#!/usr/bin/env bash
                        set -euo pipefail
                        if gh release view "${RELEASE_TAG}" --repo "${GITHUB_REPO}" >/dev/null 2>&1; then
                            gh release upload "${RELEASE_TAG}" dist/* --repo "${GITHUB_REPO}" --clobber
                        else
                            gh release create "${RELEASE_TAG}" \
                                --repo "${GITHUB_REPO}" \
                                --title "asteroid_app ${RELEASE_TAG}" \
                                --generate-notes \
                                dist/*
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'src-tauri/target/release/asteroid_app,dist/*', fingerprint: true, allowEmptyArchive: true
        }
        always {
            cleanWs()
        }
    }
}
