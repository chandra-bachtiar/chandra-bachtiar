document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalActive = document.getElementById('terminal-active');
    const terminalBody = document.getElementById('terminal-body');

    // Otomatis fokus ke input saat klik pada body terminal
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    // History perintah untuk navigasi dengan arrow up/down
    let commandHistory = [];
    let historyIndex = -1;

    // Simulasi sistem file
    const fileSystem = {
        'home': {
            'projects': {
                'point-of-sales.txt': 'Terminal-based portfolio created with HTML, CSS, and JavaScript.',
                'chat-bot.txt': 'Fullstack e-commerce platform with React and Node.js.',
                'database-mirroring.txt': 'Task management app with Vue.js and Firebase.'
            },
            'docs': {
                'resume.txt': 'Resume: Chandra bachtiar - Fullstack Developer\n\nSkills: HTML, CSS, JavaScript, React, Node.js\nExperience: 5+ years in web development',
                'contact.txt': 'Email: mail@chand.my.id\nPhone: +62 852-221-91xx'
            },
            'notes.txt': 'Jangan lupa update portfolio tiap bulan!'
        }
    };

    // Lokasi saat ini dalam sistem file
    let currentDirectory = ['home'];

    // Daftar perintah yang tersedia (untuk autocomplete)
    const availableCommands = [
        '/help', '/profile', '/about', '/skills', '/projects',
        '/experience', '/education', '/contact', '/social',
        '/resume', 'clear', 'ls', 'cd', 'echo', 'cat',
        'date', 'whoami', 'pwd'
    ];

    // Daftar perintah yang tersedia
    const commands = {
        '/help': tampilkanHelp,
        '/profile': tampilkanProfile,
        '/about': tampilkanAbout,
        '/skills': tampilkanSkills,
        '/projects': tampilkanProjects,
        '/experience': tampilkanExperience,
        '/education': tampilkanEducation,
        '/contact': tampilkanContact,
        '/social': tampilkanSocial,
        '/resume': tampilkanResume,
        'clear': clearTerminal,
        'ls': listFiles,
        'cd': changeDirectory,
        'echo': echoText,
        'cat': displayFileContent,
        'date': showDate,
        'whoami': showUser,
        'pwd': showCurrentPath
    };

    // Event listener untuk input
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();

            if (command) {
                // Tambahkan perintah ke history
                commandHistory.push(command);
                historyIndex = commandHistory.length;

                // Tampilkan perintah yang diketik user
                const outputCommand = document.createElement('div');
                const directoryPath = currentDirectory.join('/') ? `/${currentDirectory.join('/')}` : '/';
                outputCommand.innerHTML = `<span class="terminal-prompt">chandra@portfolio:~${directoryPath}$</span> ${command}`;
                terminalOutput.appendChild(outputCommand);

                // Proses perintah
                prosesPerintah(command);

                // Reset input
                terminalInput.value = '';

                // Scroll ke bawah
                terminalBody.scrollTop = terminalBody.scrollHeight;
                terminalActive.innerHTML = `<span class="terminal-prompt">chandra@portfolio:~${directoryPath}$</span>`;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            autocompleteCommand();
        }
    });

    // Fungsi untuk autocomplete command
    function autocompleteCommand() {
        const input = terminalInput.value.trim();
        if (input) {
            const matchingCommands = availableCommands.filter(cmd =>
                cmd.startsWith(input)
            );

            if (matchingCommands.length === 1) {
                // Jika hanya ada satu command yang cocok, langsung isi
                terminalInput.value = matchingCommands[0];
            } else if (matchingCommands.length > 1) {
                // Jika ada beberapa command yang cocok, tampilkan opsi
                const outputElement = document.createElement('div');
                outputElement.className = 'output-section';
                outputElement.innerHTML = `<p>${matchingCommands.join('  ')}</p>`;
                terminalOutput.appendChild(outputElement);

                // Isi dengan prefix yang sama
                let commonPrefix = matchingCommands[0];
                for (let i = 1; i < matchingCommands.length; i++) {
                    let j = 0;
                    while (j < commonPrefix.length &&
                        j < matchingCommands[i].length &&
                        commonPrefix[j] === matchingCommands[i][j]) {
                        j++;
                    }
                    commonPrefix = commonPrefix.substring(0, j);
                }

                if (commonPrefix.length > input.length) {
                    terminalInput.value = commonPrefix;
                }

                // Scroll ke bawah
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        }
    }

    // Fungsi untuk memproses perintah
    // Fungsi untuk memproses perintah
    function prosesPerintah(commandStr) {
        const args = commandStr.split(' ');
        const command = args[0];

        if (commands[command]) {
            commands[command](args.slice(1));
        } else if (easterEggCommands[commandStr.trim()]) {
            easterEggCommands[commandStr.trim()]();
        } else {
            const outputElement = document.createElement('div');
            outputElement.className = 'error-message';
            outputElement.textContent = `Perintah "${command}" tidak dikenali. Ketik /help untuk melihat daftar perintah.`;
            terminalOutput.appendChild(outputElement);
        }
    }
    // Implementasi perintah-perintah
    function tampilkanHelp() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Daftar Perintah:</h2>
            <p><span class="command">/help</span> - Menampilkan daftar perintah</p>
            <p><span class="command">/profile</span> - Menampilkan profil singkat</p>
            <p><span class="command">/about</span> - Tentang saya</p>
            <p><span class="command">/skills</span> - Keahlian teknis</p>
            <p><span class="command">/projects</span> - Daftar proyek</p>
            <p><span class="command">/experience</span> - Pengalaman kerja</p>
            <p><span class="command">/education</span> - Pendidikan</p>
            <p><span class="command">/contact</span> - Informasi kontak</p>
            <p><span class="command">/social</span> - Media sosial</p>
            <p><span class="command">/resume</span> - Lihat/download CV</p>
            <p><span class="command">clear</span> - Bersihkan terminal</p>
            <br>
            <h2>Basic Commands:</h2>
            <p><span class="command">ls</span> - Lihat daftar file dan folder</p>
            <p><span class="command">cd [directory]</span> - Pindah directory</p>
            <p><span class="command">pwd</span> - Tampilkan lokasi saat ini</p>
            <p><span class="command">cat [file]</span> - Tampilkan isi file</p>
            <p><span class="command">echo [text]</span> - Tampilkan teks</p>
            <p><span class="command">date</span> - Tampilkan tanggal dan waktu</p>
            <p><span class="command">whoami</span> - Tampilkan user</p>
        `;
        terminalOutput.appendChild(outputElement);
    }

    // [Fungsi lama untuk profile, about, skills, projects, dll. tetap sama]
    function tampilkanProfile() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Profil</h2>
            <p>Nama: Chandra Bachtiar</p>
            <p>Profesi: Fullstack Developer</p>
            <p>Lokasi: Indonesia</p>
            <p>Status: Siap untuk tantangan baru!</p>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanAbout() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Tentang Saya</h2>
            <p>Halo! Saya adalah seorang fullstack developer dengan pengalaman di bidang IT lebih dari 4 tahun, .</p>
            <p>Saya menikmati tantangan pemecahan masalah dan terus belajar teknologi baru.</p>
            <p>.</p>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanSkills() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Keahlian Teknis</h2>
            <p>Frontend:</p>
            <div class="skills-list">
                <span class="skill-item">HTML5</span>
                <span class="skill-item">CSS3</span>
                <span class="skill-item">JavaScript</span>
                <span class="skill-item">React</span>
                <span class="skill-item">Vue</span>
                <span class="skill-item">Tailwind CSS</span>
            </div>
            <p>Backend:</p>
            <div class="skills-list">
                <span class="skill-item">Node.js</span>
                <span class="skill-item">Express</span>
                <span class="skill-item">PHP</span>
                <span class="skill-item">Laravel</span>
                <span class="skill-item">Python</span>
                <span class="skill-item">Django</span>
            </div>
            <p>Database:</p>
            <div class="skills-list">
                <span class="skill-item">MySQL</span>
                <span class="skill-item">PostgreSQL</span>
                <span class="skill-item">MongoDB</span>
                <span class="skill-item">Firebase</span>
            </div>
            <p>DevOps & Tools:</p>
            <div class="skills-list">
                <span class="skill-item">Git</span>
                <span class="skill-item">Docker</span>
                <span class="skill-item">AWS</span>
                <span class="skill-item">CI/CD</span>
            </div>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanProjects() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Proyek</h2>
            
            <div class="project-item">
                <p class="project-title">E-Commerce Platform</p>
                <p class="project-tech">React, Node.js, MongoDB, Stripe</p>
                <p>Platform e-commerce lengkap dengan manajemen produk, keranjang belanja, dan integrasi pembayaran.</p>
            </div>
            
            <div class="project-item">
                <p class="project-title">Task Management App</p>
                <p class="project-tech">Vue.js, Firebase, Tailwind CSS</p>
                <p>Aplikasi manajemen tugas dengan fitur drag-and-drop, notifikasi, dan kolaborasi tim.</p>
            </div>
            
            <div class="project-item">
                <p class="project-title">Portfolio Terminal</p>
                <p class="project-tech">HTML, CSS, JavaScript</p>
                <p>Website portfolio berbasis terminal dengan antarmuka command line yang interaktif.</p>
            </div>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanExperience() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Pengalaman Kerja</h2>
            
            <div class="project-item">
                <p class="project-title">Senior Fullstack Developer - PT. Tech Solutions</p>
                <p class="project-tech">2023 - Sekarang</p>
                <p>Memimpin tim pengembangan untuk proyek-proyek enterprise, mengimplementasikan arsitektur microservices, dan meningkatkan performa aplikasi.</p>
            </div>
            
            <div class="project-item">
                <p class="project-title">Web Developer - Startup XYZ</p>
                <p class="project-tech">2020 - 2023</p>
                <p>Mengembangkan fitur-fitur baru, melakukan maintenance sistem, dan berkolaborasi dengan tim produk dan desain.</p>
            </div>
            
            <div class="project-item">
                <p class="project-title">Freelance Developer</p>
                <p class="project-tech">2018 - 2020</p>
                <p>Mengerjakan berbagai proyek untuk klien dari berbagai industri seperti e-commerce, pendidikan, dan kesehatan.</p>
            </div>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanEducation() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Pendidikan</h2>
            
            <div class="project-item">
                <p class="project-title">S1 Teknik Informatika</p>
                <p class="project-tech">Universitas XYZ - 2016-2020</p>
                <p>Fokus pada pengembangan web dan mobile. Skripsi tentang implementasi teknologi AI pada aplikasi web.</p>
            </div>
            
            <div class="project-item">
                <p class="project-title">Sertifikasi AWS Solution Architect</p>
                <p class="project-tech">2022</p>
                <p>Sertifikasi profesional untuk perancangan arsitektur cloud yang scalable dan reliable.</p>
            </div>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanContact() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Kontak</h2>
            <p>Email: <a href="mailto:email@contoh.com" style="color: var(--accent-color);">email@contoh.com</a></p>
            <p>Telepon: +62 123-4567-8910</p>
            <p>Lokasi: Jakarta, Indonesia</p>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanSocial() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Media Sosial</h2>
            <p>GitHub: <a href="https://github.com/chandra-bachtiar" target="_blank" style="color: var(--accent-color);">@chandra-bachtiar</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/chandra-bachtiar" target="_blank" style="color: var(--accent-color);">chandra bachtiar</a></p>
            <p>Twitter: <a href="https://twitter.com/chaaannd" target="_blank" style="color: var(--accent-color);">@chaaannd</a></p>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function tampilkanResume() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
            <h2>Resume / CV</h2>
            <p>Unduh CV saya dalam format PDF:</p>
            <p><a href="#" style="color: var(--command-color);">chandra_cv.pdf</a></p>
        `;
        terminalOutput.appendChild(outputElement);
    }

    function clearTerminal() {
        terminalOutput.innerHTML = '';
    }

    // Implementasi basic commands

    // ls - list files/directories
    function listFiles() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';

        // Dapatkan direktori saat ini
        let currentDir = getCurrentDir();

        // Dapatkan konten direktori
        let content = '';

        // Tampilkan folder dengan warna berbeda
        for (let item in currentDir) {
            if (typeof currentDir[item] === 'object') {
                content += `<span style="color: var(--secondary-color);">${item}/</span>  `;
            } else {
                content += `<span style="color: var(--text-color);">${item}</span>  `;
            }
        }

        outputElement.innerHTML = `<p>${content || 'Direktori kosong'}</p>`;
        terminalOutput.appendChild(outputElement);
    }

    // cd - change directory
    function changeDirectory(args) {
        if (!args || args.length === 0) {
            // cd tanpa argumen, kembali ke home
            currentDirectory = ['home'];
            return;
        }

        const path = args[0];
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';

        if (path === '..') {
            // Pindah ke direktori parent
            if (currentDirectory.length > 1) {
                currentDirectory.pop();
            }
        } else if (path === '/') {
            // Pindah ke root
            currentDirectory = ['home'];
        } else {
            // Cek apakah direktori ada
            const currentDir = getCurrentDir();

            if (currentDir[path] && typeof currentDir[path] === 'object') {
                currentDirectory.push(path);
            } else {
                outputElement.innerHTML = `<p class="error-message">cd: ${path}: Direktori tidak ditemukan</p>`;
                terminalOutput.appendChild(outputElement);
            }
        }
    }

    // echo - menampilkan teks
    function echoText(args) {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `<p>${args.join(' ')}</p>`;
        terminalOutput.appendChild(outputElement);
    }

    // cat - menampilkan isi file
    function displayFileContent(args) {
        if (!args || args.length === 0) {
            const outputElement = document.createElement('div');
            outputElement.className = 'error-message';
            outputElement.textContent = 'Penggunaan: cat [nama_file]';
            terminalOutput.appendChild(outputElement);
            return;
        }

        const filename = args[0];
        const currentDir = getCurrentDir();

        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';

        if (currentDir[filename] && typeof currentDir[filename] === 'string') {
            outputElement.innerHTML = `<pre>${currentDir[filename]}</pre>`;
        } else {
            outputElement.className = 'error-message';
            outputElement.textContent = `cat: ${filename}: File tidak ditemukan`;
        }

        terminalOutput.appendChild(outputElement);
    }

    // date - menampilkan tanggal dan waktu
    function showDate() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        const now = new Date();
        outputElement.innerHTML = `<p>${now.toString()}</p>`;
        terminalOutput.appendChild(outputElement);
    }

    // whoami - menampilkan user
    function showUser() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `<p>chandrabachtiar</p>`;
        terminalOutput.appendChild(outputElement);
    }

    // pwd - menampilkan path saat ini
    function showCurrentPath() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `<p>/${currentDirectory.join('/')}</p>`;
        terminalOutput.appendChild(outputElement);
    }

    // Helper untuk mendapatkan direktori saat ini
    function getCurrentDir() {
        let dir = fileSystem;
        for (let i = 0; i < currentDirectory.length; i++) {
            dir = dir[currentDirectory[i]];
        }
        return dir;
    }

    // Tampilkan pesan welcome saat pertama kali dibuka
    terminalInput.focus();

    // Tambahkan kode ini di bagian akhir script.js sebelum tag penutup })

    // Tambahkan command easter egg
    const easterEggCommands = {
        '42': showAnswer,
        'matrix': showMatrix,
        'pacman': showPacman,
        'flip': flipTable,
        'party': startParty,
        'thanos': thanosEffect,
        'rm -rf': dontDoIt
    };

    // Tambahkan deteksi Konami Code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                unlockSecret();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Fungsi easter egg
    function showAnswer() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
        <h2>42</h2>
        <p>Jawaban untuk pertanyaan mendasar tentang kehidupan, alam semesta, dan segalanya.</p>
    `;
        terminalOutput.appendChild(outputElement);
    }

    function showMatrix() {
        // Kosongkan terminal dulu
        clearTerminal();

        // Buat canvas untuk matrix effect
        const canvas = document.createElement('canvas');
        canvas.width = terminalBody.offsetWidth;
        canvas.height = 300;
        canvas.style.marginBottom = '15px';
        terminalOutput.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Karakter untuk matrix
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
        const fontSize = 14;
        const columns = canvas.width / fontSize;

        // Array untuk posisi Y dari masing-masing karakter
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // Warna hijau matrix
        const matrixInterval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }, 33);

        // Hentikan efek setelah 10 detik
        setTimeout(() => {
            clearInterval(matrixInterval);

            // Tampilkan pesan
            const outputElement = document.createElement('div');
            outputElement.className = 'output-section';
            outputElement.innerHTML = `<p>Pilih pill yang mana? <span style="color: blue;">Blue</span> atau <span style="color: red;">Red</span>?</p>`;
            terminalOutput.appendChild(outputElement);
        }, 10000);
    }

    function showPacman() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
        <pre style="color: yellow;">
  .--.    .--.    .--.    .--.    .--.    .--.    .--.  
 /    \\  /    \\  /    \\  /    \\  /    \\  /    \\  /    \\ 
|  .-. ||  .-. ||  .-. ||  .-. ||  .-. ||  .-. ||  .-. |
| |  | || |  | || |  | || |  | || |  | || |  | || |  | |
|  \`-\` |\\  \`-\` /|  \`-\` |\\  \`-\` /|  \`-\` |\\  \`-\` /|  \`-\` |
 \\____/  \\____/  \\____/  \\____/  \\____/  \\____/  \\____/ 
                                                        
     .--.      .---.     
   .'_\\/_'.   | \\/  \\    
   '.____.'   | |\\__/    
              |_|        
              '-'        
        </pre>
        <p>WAKA WAKA WAKA...</p>
    `;
        terminalOutput.appendChild(outputElement);
    }

    function flipTable() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `<p>(╯°□°)╯︵ ┻━┻</p>`;
        terminalOutput.appendChild(outputElement);
    }

    function startParty() {
        // Manipulasi CSS untuk efek party
        const style = document.createElement('style');
        style.id = 'party-style';
        style.innerHTML = `
        @keyframes partyBackground {
            0% { background-color: #ff0000; }
            20% { background-color: #ffff00; }
            40% { background-color: #00ff00; }
            60% { background-color: #00ffff; }
            80% { background-color: #0000ff; }
            100% { background-color: #ff00ff; }
        }
        
        @keyframes partyText {
            0% { color: #ffffff; }
            25% { color: #ffff00; }
            50% { color: #00ffff; }
            75% { color: #ff00ff; }
            100% { color: #ffffff; }
        }
        
        .terminal-body {
            animation: partyBackground 3s infinite;
        }
        
        .terminal-output, .terminal-prompt, .terminal-input {
            animation: partyText 2s infinite;
        }
    `;

        document.head.appendChild(style);

        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `<p>🎉 PARTY TIME! 🎉</p>`;
        terminalOutput.appendChild(outputElement);

        // Hentikan party setelah 10 detik
        setTimeout(() => {
            document.getElementById('party-style').remove();
        }, 10000);
    }

    function thanosEffect() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `<p>Menjentikkan jari...</p>`;
        terminalOutput.appendChild(outputElement);

        // Seleksi setengah elemen di terminal
        const children = Array.from(terminalOutput.children);
        const half = Math.floor(children.length / 2);
        const selectedElements = children.slice(0, half);

        // Efek thanos
        setTimeout(() => {
            selectedElements.forEach(element => {
                element.style.transition = 'opacity 1.5s ease-in-out';
                element.style.opacity = 0;
            });

            setTimeout(() => {
                selectedElements.forEach(element => {
                    element.remove();
                });

                // Pesan setelah efek
                const outputElement = document.createElement('div');
                outputElement.className = 'output-section';
                outputElement.innerHTML = `<p>"Perfectly balanced, as all things should be."</p>`;
                terminalOutput.appendChild(outputElement);
            }, 1500);
        }, 1000);
    }

    function dontDoIt() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
        <p class="error-message">rm: segmentation fault (core dumped)</p>
        <p class="error-message">fatal error: file system corrupted</p>
        <p class="error-message">initiating emergency shutdown...</p>
    `;
        terminalOutput.appendChild(outputElement);

        // Fake shutdown effect
        setTimeout(() => {
            terminalBody.style.transition = 'opacity 1s';
            terminalBody.style.opacity = '0';

            setTimeout(() => {
                terminalBody.innerHTML = '<p style="text-align: center; padding-top: 50px;">System halted. Press any key to reboot.</p>';
                terminalBody.style.opacity = '1';

                // Listener untuk "reboot"
                const rebootListener = function () {
                    window.location.reload();
                };

                window.addEventListener('keydown', rebootListener);
                window.addEventListener('click', rebootListener);
            }, 1000);
        }, 2000);
    }

    function unlockSecret() {
        const outputElement = document.createElement('div');
        outputElement.className = 'output-section';
        outputElement.innerHTML = `
        <h2 style="color: gold; text-align: center;">🏆 KONAMI CODE UNLOCKED! 🏆</h2>
        <p style="text-align: center;">Kamu menemukan fitur rahasia!</p>
        <p style="text-align: center;">Command rahasia berikut telah diaktifkan:</p>
        <ul style="list-style-type: none; text-align: center;">
            <li><span class="command">42</span> - Jawaban dari segalanya</li>
            <li><span class="command">matrix</span> - Masuk ke Matrix</li>
            <li><span class="command">pacman</span> - Waka waka</li>
            <li><span class="command">flip</span> - Lempar meja</li>
            <li><span class="command">party</span> - PARTY TIME!</li>
            <li><span class="command">thanos</span> - Snap!</li>
            <li><span class="command">rm -rf</span> - Jangan dicoba!</li>
        </ul>
    `;
        terminalOutput.appendChild(outputElement);
    }

    // Tambahkan easter egg commands ke proses perintah
    const originalProsesPerintah = prosesPerintah;
    prosesPerintah = function (commandStr) {
        const command = commandStr.trim();

        if (easterEggCommands[command]) {
            easterEggCommands[command]();
        } else {
            originalProsesPerintah(commandStr);
        }
    };

});