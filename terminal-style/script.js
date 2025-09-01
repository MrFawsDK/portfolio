// Terminal Style Portfolio - Advanced Interactive JavaScript
class PortfolioTerminal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        this.isBootComplete = false;
        this.matrixInterval = null;
        
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            projects: this.showProjects.bind(this),
            contact: this.showContact.bind(this),
            resume: this.downloadResume.bind(this),
            clear: this.clearTerminal.bind(this),
            matrix: this.startMatrix.bind(this),
            exit: this.exitTerminal.bind(this),
            ls: this.listFiles.bind(this),
            whoami: this.whoAmI.bind(this),
            pwd: this.showPath.bind(this),
            date: this.showDate.bind(this),
            uptime: this.showUptime.bind(this),
            neofetch: this.showSystemInfo.bind(this),
            github: this.openGithub.bind(this),
            linkedin: this.openLinkedIn.bind(this),
            email: this.openEmail.bind(this)
        };
        
        this.startTime = Date.now();
        this.init();
    }
    
    init() {
        setTimeout(() => {
            this.isBootComplete = true;
            this.setupEventListeners();
            this.startUptime();
            this.updateCursorPosition();
            document.getElementById('commandInput').focus();
        }, 3000);
    }
    
    setupEventListeners() {
        const input = document.getElementById('commandInput');
        
        input.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Enter':
                    this.processCommand(input.value.trim());
                    input.value = '';
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateHistory('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateHistory('down');
                    break;
                case 'Tab':
                    e.preventDefault();
                    this.autoComplete(input.value);
                    break;
                case 'Escape':
                    if (document.getElementById('matrixOverlay').classList.contains('active')) {
                        this.stopMatrix();
                    }
                    break;
            }
        });
        
        input.addEventListener('input', () => {
            this.updateCursorPosition();
        });
        
        // Terminal controls
        document.querySelector('.control.close').addEventListener('click', () => {
            if (confirm('Are you sure you want to close the terminal?')) {
                window.close();
            }
        });
        
        document.querySelector('.control.minimize').addEventListener('click', () => {
            document.querySelector('.terminal-window').style.transform = 'scale(0.1)';
            setTimeout(() => {
                document.querySelector('.terminal-window').style.transform = 'scale(1)';
            }, 1000);
        });
        
        document.querySelector('.control.maximize').addEventListener('click', () => {
            document.querySelector('.terminal-window').classList.toggle('maximized');
        });
    }
    
    processCommand(command) {
        if (!this.isBootComplete) return;
        
        this.addToHistory(command);
        this.addOutput(`<span class="prompt">MrFawsDK@portfolio:${this.currentPath}$ </span>${command}`);
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else if (command.trim() === '') {
            // Empty command, just show new prompt
        } else {
            this.addOutput(`bash: ${cmd}: command not found`, 'error');
            this.addOutput('Type <span class="cmd">help</span> to see available commands.');
        }
        
        this.scrollToBottom();
    }
    
    addOutput(content, className = '') {
        const output = document.getElementById('commandOutput');
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = content;
        output.appendChild(line);
    }
    
    addToHistory(command) {
        if (command.trim() && this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
        }
        this.historyIndex = this.commandHistory.length;
    }
    
    navigateHistory(direction) {
        const input = document.getElementById('commandInput');
        
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex++;
            input.value = '';
        }
        
        this.updateCursorPosition();
    }
    
    autoComplete(partial) {
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(partial.toLowerCase())
        );
        
        if (matches.length === 1) {
            document.getElementById('commandInput').value = matches[0];
            this.updateCursorPosition();
        } else if (matches.length > 1) {
            this.addOutput(`\n${matches.join('  ')}`);
        }
    }
    
    updateCursorPosition() {
        const input = document.getElementById('commandInput');
        document.getElementById('cursorPos').textContent = input.value.length + 1;
    }
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    startUptime() {
        setInterval(() => {
            const uptime = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('uptime').textContent = uptime;
        }, 1000);
    }
    
    // Command implementations
    showHelp() {
        this.addOutput('\n<span class="warning">Available Commands:</span>\n');
        Object.keys(this.commands).forEach(cmd => {
            const descriptions = {
                help: 'Show this help menu',
                about: 'Display information about MrFawsDK',
                skills: 'List technical skills and proficiency levels',
                projects: 'Show portfolio projects',
                contact: 'Get contact information',
                resume: 'Download CV/Resume',
                clear: 'Clear the terminal screen',
                matrix: 'Enter the Matrix (Easter egg)',
                exit: 'Return to main portfolio',
                ls: 'List directory contents',
                whoami: 'Display current user',
                pwd: 'Show current directory path',
                date: 'Display current date and time',
                uptime: 'Show system uptime',
                neofetch: 'Display system information',
                github: 'Open GitHub profile',
                linkedin: 'Open LinkedIn profile',
                email: 'Open email client'
            };
            
            this.addOutput(`  <span class="cmd">${cmd.padEnd(12)}</span> - ${descriptions[cmd]}`);
        });
        this.addOutput('\nTip: Use TAB for auto-completion, UP/DOWN arrows for command history');
    }
    
    showAbout() {
        this.addOutput('\n<span class="info">About MrFawsDK:</span>\n');
        this.addOutput('╔══════════════════════════════════════════════════════════╗');
        this.addOutput('║  Name: MrFawsDK                                          ║');
        this.addOutput('║  Role: Full-Stack Web Developer & Designer              ║');
        this.addOutput('║  Experience: 5+ years                                   ║');
        this.addOutput('║  Location: Denmark                                       ║');
        this.addOutput('║  Passion: Creating modern, interactive web solutions    ║');
        this.addOutput('╚══════════════════════════════════════════════════════════╝\n');
        
        this.addOutput('I am a dedicated web developer with expertise in both frontend');
        this.addOutput('and backend development. My passion lies in transforming creative');
        this.addOutput('ideas into functional, user-friendly websites and applications.');
        this.addOutput('\nI specialize in modern web technologies and love exploring');
        this.addOutput('new tools and frameworks to deliver cutting-edge solutions.');
    }
    
    showSkills() {
        this.addOutput('\n<span class="success">Technical Skills:</span>\n');
        
        const skills = [
            { name: 'HTML5', level: 95 },
            { name: 'CSS3', level: 90 },
            { name: 'JavaScript', level: 88 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 80 },
            { name: 'PHP', level: 82 },
            { name: 'MySQL', level: 78 },
            { name: 'Git', level: 85 },
            { name: 'WordPress', level: 90 },
            { name: 'Figma', level: 75 }
        ];
        
        this.addOutput('<div class="skills-container">');
        skills.forEach(skill => {
            this.addOutput(`
                <div class="skill-item">
                    <span class="skill-name">${skill.name}</span>
                    <div class="skill-bar">
                        <div class="skill-progress" style="--progress: ${skill.level}%; width: ${skill.level}%;"></div>
                    </div>
                    <span class="skill-percentage">${skill.level}%</span>
                </div>
            `);
        });
        this.addOutput('</div>');
    }
    
    showProjects() {
        this.addOutput('\n<span class="warning">Portfolio Projects:</span>\n');
        
        const projects = [
            {
                title: 'Portfolio Universe',
                description: 'A comprehensive collection of different portfolio styles - from terminal interface to modern timeline design.',
                tech: 'HTML5, CSS3, JavaScript, Responsive Design'
            },
            {
                title: 'E-Commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
                tech: 'React, Node.js, MongoDB, Stripe API'
            },
            {
                title: 'Blog Platform',
                description: 'Modern blog platform with dynamic content, comment system, and responsive design.',
                tech: 'React, Node.js, MongoDB, Express'
            },
            {
                title: 'Task Management App',
                description: 'Collaborative task management application with real-time updates and team features.',
                tech: 'Vue.js, Firebase, Vuex, PWA'
            },
            {
                title: 'Weather Dashboard',
                description: 'Interactive weather dashboard with forecasts, maps, and location-based services.',
                tech: 'JavaScript, OpenWeather API, Chart.js'
            }
        ];
        
        projects.forEach((project, index) => {
            this.addOutput(`
                <div class="project-item">
                    <div class="project-title">${index + 1}. ${project.title}</div>
                    <div class="project-description">${project.description}</div>
                    <div class="project-tech">Technologies: ${project.tech}</div>
                </div>
            `);
        });
    }
    
    showContact() {
        this.addOutput('\n<span class="info">Contact Information:</span>\n');
        this.addOutput('<div class="contact-info">');
        this.addOutput(`
            <div class="contact-item">
                <span class="contact-label">Email:</span>
                <span class="contact-value">
                    <a href="mailto:contact@mrfawsdk.com">contact@mrfawsdk.com</a>
                </span>
            </div>
            <div class="contact-item">
                <span class="contact-label">GitHub:</span>
                <span class="contact-value">
                    <a href="https://github.com/mrfawsdk" target="_blank">github.com/mrfawsdk</a>
                </span>
            </div>
            <div class="contact-item">
                <span class="contact-label">LinkedIn:</span>
                <span class="contact-value">
                    <a href="#" target="_blank">linkedin.com/in/mrfawsdk</a>
                </span>
            </div>
            <div class="contact-item">
                <span class="contact-label">Location:</span>
                <span class="contact-value">Denmark, Europe</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">Status:</span>
                <span class="contact-value">Available for projects</span>
            </div>
        `);
        this.addOutput('</div>');
        this.addOutput('\nFeel free to reach out for collaborations or project inquiries!');
    }
    
    downloadResume() {
        this.addOutput('\n<span class="success">Initiating CV download...</span>');
        this.addOutput('Please wait while we prepare your download...');
        
        setTimeout(() => {
            this.addOutput('<span class="success">✓ Download started!</span>');
            window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
        }, 1500);
    }
    
    clearTerminal() {
        document.getElementById('commandOutput').innerHTML = '';
    }
    
    startMatrix() {
        const overlay = document.getElementById('matrixOverlay');
        overlay.classList.add('active');
        this.createMatrixEffect();
    }
    
    stopMatrix() {
        const overlay = document.getElementById('matrixOverlay');
        overlay.classList.remove('active');
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
        }
    }
    
    createMatrixEffect() {
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        this.matrixInterval = setInterval(draw, 35);
    }
    
    exitTerminal() {
        this.addOutput('\n<span class="warning">Exiting terminal...</span>');
        this.addOutput('Goodbye! Thanks for visiting my portfolio.');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
    
    listFiles() {
        this.addOutput('\ntotal 8');
        this.addOutput('drwxr-xr-x  2 mrfawsdk mrfawsdk 4096 Jan  1 12:00 <span class="info">projects/</span>');
        this.addOutput('drwxr-xr-x  2 mrfawsdk mrfawsdk 4096 Jan  1 12:00 <span class="info">skills/</span>');
        this.addOutput('-rw-r--r--  1 mrfawsdk mrfawsdk 1024 Jan  1 12:00 <span class="success">resume.pdf</span>');
        this.addOutput('-rw-r--r--  1 mrfawsdk mrfawsdk  512 Jan  1 12:00 contact.txt');
        this.addOutput('-rw-r--r--  1 mrfawsdk mrfawsdk  256 Jan  1 12:00 about.md');
    }
    
    whoAmI() {
        this.addOutput('MrFawsDK');
    }
    
    showPath() {
        this.addOutput(`/home/mrfawsdk${this.currentPath === '~' ? '' : '/' + this.currentPath}`);
    }
    
    showDate() {
        this.addOutput(new Date().toString());
    }
    
    showUptime() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        this.addOutput(`up ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
    
    showSystemInfo() {
        this.addOutput('\n<span class="info">System Information:</span>\n');
        this.addOutput('                   -`                  mrfawsdk@portfolio');
        this.addOutput('                  .o+`                 ------------------');
        this.addOutput('                 `ooo/                 OS: Portfolio Linux x86_64');
        this.addOutput('                `+oooo:                Host: Web Developer Workstation');
        this.addOutput('               `+oooooo:               Kernel: WebDev 5.15.0-portfolio');
        this.addOutput('               -+oooooo+:              Uptime: ' + Math.floor((Date.now() - this.startTime) / 1000) + ' seconds');
        this.addOutput('             `/:-:++oooo+:             Packages: HTML, CSS, JS, React');
        this.addOutput('            `/++++/+++++++:            Shell: /bin/portfolio');
        this.addOutput('           `/++++++++++++++:           Terminal: WebTerminal');
        this.addOutput('          `/+++ooooooooo+++/          CPU: Brain (2 cores) @ 3.4GHz');
        this.addOutput('         ./ooosssso++osssssso+`       Memory: Ideas (∞GB)');
        this.addOutput('        .oossssso-````/ossssss+`      Theme: Terminal Green');
        this.addOutput('       -osssssso.      :ssssssso.     Icons: Font Awesome');
        this.addOutput('      :osssssss/        osssso+++.');
    }
    
    openGithub() {
        this.addOutput('\n<span class="success">Opening GitHub profile...</span>');
        setTimeout(() => {
            window.open('https://github.com/mrfawsdk', '_blank');
        }, 1000);
    }
    
    openLinkedIn() {
        this.addOutput('\n<span class="success">Opening LinkedIn profile...</span>');
        setTimeout(() => {
            window.open('#', '_blank');
        }, 1000);
    }
    
    openEmail() {
        this.addOutput('\n<span class="success">Opening email client...</span>');
        setTimeout(() => {
            window.location.href = 'mailto:contact@mrfawsdk.com';
        }, 1000);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioTerminal();
});

// Matrix effect for canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Konami code easter egg
let konami = [];
const secret = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
window.addEventListener('keydown', function(e) {
  konami.push(e.key);
  if (konami.length > secret.length) konami.shift();
  if (konami.join('').toLowerCase() === secret.join('').toLowerCase()) {
    alert('🎉 Du fandt et easter egg!');
    konami = [];
  }
});
