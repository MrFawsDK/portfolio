// MrFawsDK OS - Desktop Portfolio JavaScript
class DesktopOS {
    constructor() {
        this.windows = [];
        this.windowZIndex = 1000;
        this.draggedWindow = null;
        this.dragOffset = { x: 0, y: 0 };
        this.startTime = Date.now();
        this.isStartMenuOpen = false;
        this.isPowerMenuOpen = false;
        this.selectedIcon = null;
        
        this.init();
    }
    
    init() {
        this.showBootScreen();
        setTimeout(() => {
            this.hideBootScreen();
            this.setupEventListeners();
            this.updateClock();
            this.startClockUpdate();
        }, 3500);
    }
    
    showBootScreen() {
        document.getElementById('bootScreen').classList.add('active');
    }
    
    hideBootScreen() {
        document.getElementById('bootScreen').classList.remove('active');
    }
    
    setupEventListeners() {
        // Desktop icon clicks
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectIcon(icon);
            });
            
            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const app = icon.getAttribute('data-app');
                this.openApplication(app);
            });
        });
        
        // Start button
        document.getElementById('startButton').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });
        
        // Start menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const app = item.getAttribute('data-app');
                this.openApplication(app);
                this.closeStartMenu();
            });
        });
        
        // Power button
        document.getElementById('powerButton').addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePowerMenu();
        });
        
        // Power menu options
        document.querySelectorAll('.power-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = option.getAttribute('data-action');
                this.handlePowerAction(action);
            });
        });
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Desktop click (deselect icons, close menus)
        document.querySelector('.desktop').addEventListener('click', (e) => {
            if (e.target.classList.contains('desktop') || e.target.classList.contains('wallpaper')) {
                this.deselectAllIcons();
                this.closeAllMenus();
            }
        });
        
        // Context menu
        document.querySelector('.desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });
        
        // Context menu items
        document.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                this.handleContextAction(action);
                this.hideContextMenu();
            });
        });
        
        // Close menus on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.closeStartMenu();
            }
            if (!e.target.closest('.power-menu') && !e.target.closest('.power-button')) {
                this.closePowerMenu();
            }
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });
        
        // Window controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('window-control')) {
                const action = e.target.classList.contains('close') ? 'close' :
                             e.target.classList.contains('minimize') ? 'minimize' :
                             e.target.classList.contains('maximize') ? 'maximize' : null;
                             
                if (action) {
                    const window = e.target.closest('.window');
                    this.handleWindowControl(window, action);
                }
            }
        });
        
        // Window dragging
        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-header') || e.target.closest('.window-header')) {
                const window = e.target.closest('.window');
                this.startWindowDrag(window, e);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.draggedWindow) {
                this.dragWindow(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.stopWindowDrag();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    selectIcon(icon) {
        this.deselectAllIcons();
        icon.classList.add('selected');
        this.selectedIcon = icon;
    }
    
    deselectAllIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
        this.selectedIcon = null;
    }
    
    openApplication(appName) {
        const appConfigs = {
            about: {
                title: 'About Me',
                icon: 'fas fa-user',
                content: this.getAboutContent(),
                width: 500,
                height: 400
            },
            projects: {
                title: 'Projects',
                icon: 'fas fa-folder',
                content: this.getProjectsContent(),
                width: 600,
                height: 500
            },
            skills: {
                title: 'Skills',
                icon: 'fas fa-chart-bar',
                content: this.getSkillsContent(),
                width: 550,
                height: 450
            },
            contact: {
                title: 'Contact',
                icon: 'fas fa-envelope',
                content: this.getContactContent(),
                width: 450,
                height: 350
            },
            resume: {
                title: 'Resume',
                icon: 'fas fa-file-pdf',
                content: this.getResumeContent(),
                width: 400,
                height: 300
            },
            browser: {
                title: 'Web Browser',
                icon: 'fab fa-chrome',
                content: this.getBrowserContent(),
                width: 800,
                height: 600
            },
            calculator: {
                title: 'Calculator',
                icon: 'fas fa-calculator',
                content: this.getCalculatorContent(),
                width: 300,
                height: 400
            },
            notepad: {
                title: 'Notepad',
                icon: 'fas fa-sticky-note',
                content: this.getNotepadContent(),
                width: 500,
                height: 400
            },
            settings: {
                title: 'Settings',
                icon: 'fas fa-cog',
                content: this.getSettingsContent(),
                width: 600,
                height: 500
            },
            'file-manager': {
                title: 'File Manager',
                icon: 'fas fa-folder-open',
                content: this.getFileManagerContent(),
                width: 700,
                height: 500
            }
        };
        
        const config = appConfigs[appName];
        if (config) {
            this.createWindow(config);
        }
    }
    
    createWindow(config) {
        const windowId = 'window-' + Date.now();
        const window = document.createElement('div');
        window.className = 'window';
        window.id = windowId;
        window.style.width = config.width + 'px';
        window.style.height = config.height + 'px';
        window.style.zIndex = ++this.windowZIndex;
        
        // Center window
        const centerX = (window.innerWidth - config.width) / 2;
        const centerY = (window.innerHeight - config.height - 48) / 2;
        window.style.left = Math.max(20, centerX + (this.windows.length * 30)) + 'px';
        window.style.top = Math.max(20, centerY + (this.windows.length * 30)) + 'px';
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${config.icon}"></i>
                    ${config.title}
                </div>
                <div class="window-controls">
                    <button class="window-control minimize">−</button>
                    <button class="window-control maximize">□</button>
                    <button class="window-control close">×</button>
                </div>
            </div>
            <div class="window-content">
                ${config.content}
            </div>
        `;
        
        document.getElementById('windowsContainer').appendChild(window);
        this.windows.push(window);
        this.addToTaskbar(windowId, config.title, config.icon);
        this.focusWindow(window);
    }
    
    handleWindowControl(window, action) {
        switch (action) {
            case 'close':
                this.closeWindow(window);
                break;
            case 'minimize':
                this.minimizeWindow(window);
                break;
            case 'maximize':
                this.toggleMaximizeWindow(window);
                break;
        }
    }
    
    closeWindow(window) {
        const windowId = window.id;
        this.removeFromTaskbar(windowId);
        this.windows = this.windows.filter(w => w !== window);
        window.remove();
    }
    
    minimizeWindow(window) {
        window.classList.add('minimized');
        const taskbarApp = document.querySelector(`[data-window-id="${window.id}"]`);
        if (taskbarApp) {
            taskbarApp.classList.remove('active');
        }
    }
    
    toggleMaximizeWindow(window) {
        window.classList.toggle('maximized');
    }
    
    focusWindow(window) {
        this.windows.forEach(w => {
            const taskbarApp = document.querySelector(`[data-window-id="${w.id}"]`);
            if (taskbarApp) {
                taskbarApp.classList.remove('active');
            }
        });
        
        window.style.zIndex = ++this.windowZIndex;
        const taskbarApp = document.querySelector(`[data-window-id="${window.id}"]`);
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
    }
    
    startWindowDrag(window, e) {
        if (window.classList.contains('maximized')) return;
        
        this.draggedWindow = window;
        this.focusWindow(window);
        
        const rect = window.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    }
    
    dragWindow(e) {
        if (!this.draggedWindow) return;
        
        const x = Math.max(0, Math.min(window.innerWidth - this.draggedWindow.offsetWidth, 
                                      e.clientX - this.dragOffset.x));
        const y = Math.max(0, Math.min(window.innerHeight - this.draggedWindow.offsetHeight - 48, 
                                      e.clientY - this.dragOffset.y));
        
        this.draggedWindow.style.left = x + 'px';
        this.draggedWindow.style.top = y + 'px';
    }
    
    stopWindowDrag() {
        this.draggedWindow = null;
    }
    
    addToTaskbar(windowId, title, icon) {
        const taskbarApps = document.getElementById('taskbarApps');
        const taskbarApp = document.createElement('button');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.setAttribute('data-window-id', windowId);
        taskbarApp.innerHTML = `<i class="${icon}"></i> ${title}`;
        
        taskbarApp.addEventListener('click', () => {
            const window = document.getElementById(windowId);
            if (window) {
                if (window.classList.contains('minimized')) {
                    window.classList.remove('minimized');
                }
                this.focusWindow(window);
            }
        });
        
        taskbarApps.appendChild(taskbarApp);
    }
    
    removeFromTaskbar(windowId) {
        const taskbarApp = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarApp) {
            taskbarApp.remove();
        }
    }
    
    toggleStartMenu() {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.getElementById('startButton');
        
        this.isStartMenuOpen = !this.isStartMenuOpen;
        startMenu.classList.toggle('active', this.isStartMenuOpen);
        startButton.classList.toggle('active', this.isStartMenuOpen);
        
        if (this.isStartMenuOpen) {
            this.closePowerMenu();
        }
    }
    
    closeStartMenu() {
        this.isStartMenuOpen = false;
        document.getElementById('startMenu').classList.remove('active');
        document.getElementById('startButton').classList.remove('active');
    }
    
    togglePowerMenu() {
        this.isPowerMenuOpen = !this.isPowerMenuOpen;
        const powerMenu = document.getElementById('powerMenu');
        powerMenu.style.display = this.isPowerMenuOpen ? 'block' : 'none';
        
        if (this.isPowerMenuOpen) {
            this.closeStartMenu();
        }
    }
    
    closePowerMenu() {
        this.isPowerMenuOpen = false;
        document.getElementById('powerMenu').style.display = 'none';
    }
    
    closeAllMenus() {
        this.closeStartMenu();
        this.closePowerMenu();
        this.hideContextMenu();
    }
    
    handlePowerAction(action) {
        switch (action) {
            case 'restart':
                this.restartSystem();
                break;
            case 'shutdown':
                this.shutdownSystem();
                break;
            case 'home':
                window.location.href = '../index.html';
                break;
        }
        this.closePowerMenu();
    }
    
    restartSystem() {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    
    shutdownSystem() {
        document.body.style.transition = 'opacity 2s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.innerHTML = '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:24px;text-align:center;"><h1>System Shutdown</h1><p>It\'s now safe to close this window.</p></div>';
            document.body.style.background = '#000';
            document.body.style.opacity = '1';
        }, 2000);
    }
    
    showContextMenu(x, y) {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = Math.min(x, window.innerWidth - contextMenu.offsetWidth) + 'px';
        contextMenu.style.top = Math.min(y, window.innerHeight - contextMenu.offsetHeight) + 'px';
    }
    
    hideContextMenu() {
        document.getElementById('contextMenu').style.display = 'none';
    }
    
    handleContextAction(action) {
        switch (action) {
            case 'refresh':
                location.reload();
                break;
            case 'personalize':
                this.openApplication('settings');
                break;
            case 'display':
                this.openApplication('settings');
                break;
        }
    }
    
    handleSearch(query) {
        // Simple search implementation
        console.log('Searching for:', query);
    }
    
    handleKeyboard(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Escape':
                    this.closeAllMenus();
                    break;
                case 'Enter':
                    if (this.selectedIcon) {
                        const app = this.selectedIcon.getAttribute('data-app');
                        this.openApplication(app);
                    }
                    break;
            }
        }
        
        if (e.key === 'Delete' && this.selectedIcon && this.selectedIcon.id === 'trashIcon') {
            // Empty trash functionality
            console.log('Emptying trash...');
        }
    }
    
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        const dateString = now.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
        
        document.querySelector('.clock .time').textContent = timeString;
        document.querySelector('.clock .date').textContent = dateString;
    }
    
    startClockUpdate() {
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }
    
    // Content generators for different applications
    getAboutContent() {
        return `
            <div style="text-align: center; padding: 20px;">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #0078d4, #106ebe); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 40px;">
                    <i class="fas fa-user"></i>
                </div>
                <h2 style="color: #0078d4; margin-bottom: 10px;">MrFawsDK</h2>
                <p style="color: #666; margin-bottom: 20px; font-size: 16px;">Full-Stack Web Developer & Designer</p>
                
                <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <h3 style="color: #333; margin-bottom: 10px;">About Me</h3>
                    <p style="line-height: 1.6; margin-bottom: 15px;">
                        I am a passionate web developer with 5+ years of experience in creating modern, 
                        responsive websites and applications. I specialize in both frontend and backend development.
                    </p>
                    
                    <h4 style="color: #0078d4; margin-bottom: 8px;">Expertise</h4>
                    <ul style="margin-bottom: 15px;">
                        <li>Frontend: HTML5, CSS3, JavaScript, React, Vue.js</li>
                        <li>Backend: Node.js, PHP, Python, MySQL</li>
                        <li>Tools: Git, WordPress, Figma, VS Code</li>
                    </ul>
                    
                    <h4 style="color: #0078d4; margin-bottom: 8px;">Location</h4>
                    <p>📍 Denmark, Europe</p>
                </div>
            </div>
        `;
    }
    
    getProjectsContent() {
        return `
            <div style="padding: 20px;">
                <h2 style="color: #0078d4; margin-bottom: 20px; text-align: center;">My Projects</h2>
                
                <div style="display: grid; gap: 15px;">
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 8px;">Portfolio Universe</h3>
                        <p style="color: #666; margin-bottom: 10px;">A collection of different portfolio styles showcasing various design approaches.</p>
                        <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px;">HTML, CSS, JavaScript</span>
                    </div>
                    
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 8px;">E-Commerce Platform</h3>
                        <p style="color: #666; margin-bottom: 10px;">Full-stack e-commerce solution with payment integration and admin dashboard.</p>
                        <span style="background: #e8f5e8; color: #388e3c; padding: 4px 8px; border-radius: 4px; font-size: 12px;">React, Node.js, MongoDB</span>
                    </div>
                    
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 8px;">Task Management App</h3>
                        <p style="color: #666; margin-bottom: 10px;">Collaborative task management with real-time updates and team features.</p>
                        <span style="background: #fff3e0; color: #f57c00; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Vue.js, Firebase</span>
                    </div>
                    
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 8px;">Weather Dashboard</h3>
                        <p style="color: #666; margin-bottom: 10px;">Interactive weather dashboard with forecasts and location-based services.</p>
                        <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 4px; font-size: 12px;">JavaScript, API Integration</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getSkillsContent() {
        return `
            <div style="padding: 20px;">
                <h2 style="color: #0078d4; margin-bottom: 20px; text-align: center;">Technical Skills</h2>
                
                <div style="display: grid; gap: 15px;">
                    ${this.generateSkillBar('HTML5', 95)}
                    ${this.generateSkillBar('CSS3', 90)}
                    ${this.generateSkillBar('JavaScript', 88)}
                    ${this.generateSkillBar('React', 85)}
                    ${this.generateSkillBar('Node.js', 80)}
                    ${this.generateSkillBar('PHP', 82)}
                    ${this.generateSkillBar('MySQL', 78)}
                    ${this.generateSkillBar('Git', 85)}
                    ${this.generateSkillBar('WordPress', 90)}
                    ${this.generateSkillBar('Figma', 75)}
                </div>
            </div>
        `;
    }
    
    generateSkillBar(skill, percentage) {
        return `
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 500; color: #333;">${skill}</span>
                    <span style="color: #666; font-size: 14px;">${percentage}%</span>
                </div>
                <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #0078d4, #106ebe); height: 100%; width: ${percentage}%; transition: width 1s ease;"></div>
                </div>
            </div>
        `;
    }
    
    getContactContent() {
        return `
            <div style="padding: 20px; text-align: center;">
                <h2 style="color: #0078d4; margin-bottom: 20px;">Contact Information</h2>
                
                <div style="display: grid; gap: 15px; max-width: 300px; margin: 0 auto;">
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-envelope" style="color: #0078d4; font-size: 20px;"></i>
                        <div style="text-align: left;">
                            <div style="font-weight: 500; color: #333;">Email</div>
                            <div style="color: #666; font-size: 14px;">contact@mrfawsdk.com</div>
                        </div>
                    </div>
                    
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <i class="fab fa-github" style="color: #0078d4; font-size: 20px;"></i>
                        <div style="text-align: left;">
                            <div style="font-weight: 500; color: #333;">GitHub</div>
                            <div style="color: #666; font-size: 14px;">github.com/mrfawsdk</div>
                        </div>
                    </div>
                    
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <i class="fab fa-linkedin" style="color: #0078d4; font-size: 20px;"></i>
                        <div style="text-align: left;">
                            <div style="font-weight: 500; color: #333;">LinkedIn</div>
                            <div style="color: #666; font-size: 14px;">linkedin.com/in/mrfawsdk</div>
                        </div>
                    </div>
                    
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-map-marker-alt" style="color: #0078d4; font-size: 20px;"></i>
                        <div style="text-align: left;">
                            <div style="font-weight: 500; color: #333;">Location</div>
                            <div style="color: #666; font-size: 14px;">Denmark, Europe</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p style="color: #666; margin: 0; font-size: 14px;">
                        Available for freelance projects and collaborations
                    </p>
                </div>
            </div>
        `;
    }
    
    getResumeContent() {
        return `
            <div style="padding: 20px; text-align: center;">
                <h2 style="color: #0078d4; margin-bottom: 20px;">Resume / CV</h2>
                
                <div style="margin-bottom: 20px;">
                    <i class="fas fa-file-pdf" style="font-size: 64px; color: #dc3545; margin-bottom: 15px;"></i>
                    <h3 style="color: #333; margin-bottom: 10px;">MrFawsDK_Resume.pdf</h3>
                    <p style="color: #666; margin-bottom: 20px;">Complete professional resume with experience, education, and portfolio details.</p>
                </div>
                
                <button onclick="window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')" 
                        style="background: #0078d4; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; display: flex; align-items: center; gap: 8px; margin: 0 auto;">
                    <i class="fas fa-download"></i>
                    Download Resume
                </button>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: left;">
                    <h4 style="color: #333; margin-bottom: 10px;">Resume Highlights</h4>
                    <ul style="color: #666; margin: 0; padding-left: 20px;">
                        <li>5+ years of web development experience</li>
                        <li>Proficient in modern web technologies</li>
                        <li>Strong portfolio of completed projects</li>
                        <li>Experience with both frontend and backend</li>
                        <li>Excellent problem-solving skills</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    getBrowserContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #f8f9fa; padding: 10px; border-bottom: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">
                    <button style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">←</button>
                    <button style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">→</button>
                    <input type="text" value="https://mrfawsdk-portfolio.com" readonly style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: white;">
                    <button style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🔍</button>
                </div>
                <div style="flex: 1; background: white; display: flex; align-items: center; justify-content: center; color: #666;">
                    <div style="text-align: center;">
                        <i class="fas fa-globe" style="font-size: 48px; margin-bottom: 15px; color: #0078d4;"></i>
                        <h3>Portfolio Website</h3>
                        <p>This would display the live portfolio website</p>
                        <button onclick="window.open('../index.html')" style="background: #0078d4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                            Visit Portfolio
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCalculatorContent() {
        return `
            <div style="padding: 20px;">
                <div style="background: #333; color: white; padding: 15px; text-align: right; font-family: monospace; font-size: 24px; margin-bottom: 15px; border-radius: 4px; min-height: 40px;">
                    0
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                    <button style="background: #f8f9fa; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">C</button>
                    <button style="background: #f8f9fa; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">±</button>
                    <button style="background: #f8f9fa; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">%</button>
                    <button style="background: #ff9500; color: white; border: none; padding: 15px; cursor: pointer; border-radius: 4px;">÷</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">7</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">8</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">9</button>
                    <button style="background: #ff9500; color: white; border: none; padding: 15px; cursor: pointer; border-radius: 4px;">×</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">4</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">5</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">6</button>
                    <button style="background: #ff9500; color: white; border: none; padding: 15px; cursor: pointer; border-radius: 4px;">−</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">1</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">2</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">3</button>
                    <button style="background: #ff9500; color: white; border: none; padding: 15px; cursor: pointer; border-radius: 4px;">+</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px; grid-column: span 2;">0</button>
                    <button style="background: white; border: 1px solid #ddd; padding: 15px; cursor: pointer; border-radius: 4px;">.</button>
                    <button style="background: #ff9500; color: white; border: none; padding: 15px; cursor: pointer; border-radius: 4px;">=</button>
                </div>
            </div>
        `;
    }
    
    getNotepadContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #f8f9fa; padding: 8px; border-bottom: 1px solid #ddd; font-size: 12px;">
                    File: Untitled.txt
                </div>
                <textarea style="flex: 1; border: none; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px; resize: none; outline: none;" placeholder="Start typing..."></textarea>
            </div>
        `;
    }
    
    getSettingsContent() {
        return `
            <div style="padding: 20px;">
                <h2 style="color: #0078d4; margin-bottom: 20px;">System Settings</h2>
                
                <div style="display: grid; gap: 15px;">
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-palette"></i>
                            Personalization
                        </h3>
                        <p style="color: #666; margin-bottom: 10px;">Customize the appearance of your desktop</p>
                        <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Change Theme</button>
                    </div>
                    
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-desktop"></i>
                            Display
                        </h3>
                        <p style="color: #666; margin-bottom: 10px;">Adjust screen resolution and display settings</p>
                        <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Display Settings</button>
                    </div>
                    
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-volume-up"></i>
                            Sound
                        </h3>
                        <p style="color: #666; margin-bottom: 10px;">Configure audio devices and sound settings</p>
                        <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Sound Settings</button>
                    </div>
                    
                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <h3 style="color: #333; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-info-circle"></i>
                            About
                        </h3>
                        <p style="color: #666; margin-bottom: 10px;">System information and version details</p>
                        <div style="font-family: monospace; font-size: 12px; color: #666;">
                            OS: MrFawsDK OS v2.0.1<br>
                            Browser: Portfolio Desktop Environment<br>
                            Developer: MrFawsDK
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getFileManagerContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #f8f9fa; padding: 10px; border-bottom: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">
                    <button style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">←</button>
                    <button style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">→</button>
                    <span style="flex: 1; padding: 6px 12px; background: white; border: 1px solid #ddd; border-radius: 4px;">📁 C:\\Users\\MrFawsDK\\Portfolio</span>
                </div>
                <div style="flex: 1; padding: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px;">
                        <div style="text-align: center; cursor: pointer; padding: 10px; border-radius: 4px; transition: background 0.2s;">
                            <i class="fas fa-folder" style="font-size: 32px; color: #ffc107; margin-bottom: 5px;"></i>
                            <div style="font-size: 12px;">Projects</div>
                        </div>
                        <div style="text-align: center; cursor: pointer; padding: 10px; border-radius: 4px; transition: background 0.2s;">
                            <i class="fas fa-folder" style="font-size: 32px; color: #ffc107; margin-bottom: 5px;"></i>
                            <div style="font-size: 12px;">Documents</div>
                        </div>
                        <div style="text-align: center; cursor: pointer; padding: 10px; border-radius: 4px; transition: background 0.2s;">
                            <i class="fas fa-file-pdf" style="font-size: 32px; color: #dc3545; margin-bottom: 5px;"></i>
                            <div style="font-size: 12px;">Resume.pdf</div>
                        </div>
                        <div style="text-align: center; cursor: pointer; padding: 10px; border-radius: 4px; transition: background 0.2s;">
                            <i class="fas fa-file-image" style="font-size: 32px; color: #28a745; margin-bottom: 5px;"></i>
                            <div style="font-size: 12px;">Profile.jpg</div>
                        </div>
                        <div style="text-align: center; cursor: pointer; padding: 10px; border-radius: 4px; transition: background 0.2s;">
                            <i class="fas fa-file-code" style="font-size: 32px; color: #6f42c1; margin-bottom: 5px;"></i>
                            <div style="font-size: 12px;">index.html</div>
                        </div>
                        <div style="text-align: center; cursor: pointer; padding: 10px; border-radius: 4px; transition: background 0.2s;">
                            <i class="fas fa-file-code" style="font-size: 32px; color: #17a2b8; margin-bottom: 5px;"></i>
                            <div style="font-size: 12px;">styles.css</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize Desktop OS when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DesktopOS();
});
