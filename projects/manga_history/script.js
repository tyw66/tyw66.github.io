class TimelineApp {
    constructor() {
        this.timelineNodes = document.getElementById('timelineNodes');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.sidebarClose = document.getElementById('sidebarClose');
        this.sidebarName = document.getElementById('sidebarName');
        this.sidebarDate = document.getElementById('sidebarDate');
        this.sidebarAuthor = document.getElementById('sidebarAuthor');
        this.sidebarDescription = document.getElementById('sidebarDescription');
        this.sidebarImage = document.getElementById('sidebarImage');
        
        this.events = [];
        this.currentNode = null;
        this.sidebarVisible = false;
        
        this.init();
    }
    
    async init() {
        await this.loadEvents();
        this.renderTimeline();
        this.bindEvents();
    }
    
    async loadEvents() {
        try {
            const response = await fetch('/projects/manga_history/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.events = await response.json();
        } catch (error) {
            console.error('Failed to load events:', error);
            this.events = this.getDefaultEvents();
        }
    }
    
    getDefaultEvents() {
        return [
            { name: '示例日漫1', date: '2000-01-01', description: '这是一个示例日漫作品描述。' },
            { name: '示例日漫2', date: '2010-06-15', description: '这是另一个示例日漫作品描述。' },
            { name: '示例日漫3', date: '2020-12-25', description: '这是第三个示例日漫作品描述。' }
        ];
    }
    
    renderTimeline() {
        this.timelineNodes.innerHTML = '';
        
        const getYear = (dateStr) => {
            const match = dateStr.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        };
        
        const yearRange = [];
        const eventMap = new Map();
        
        this.events.forEach(event => {
            const year = getYear(event.date);
            if (year > 0) {
                if (!eventMap.has(year)) {
                    eventMap.set(year, []);
                }
                eventMap.get(year).push(event);
            }
        });
        
        eventMap.forEach(events => {
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        });
        
        for (let year = 1945; year <= 2045; year++) {
            yearRange.push({
                year: year,
                events: eventMap.get(year) || []
            });
        }
        
        yearRange.forEach((data, index) => {
            const node = document.createElement('div');
            node.className = 'timeline-node';
            node.dataset.year = data.year;
            if (data.events.length > 0) {
                node.dataset.hasEvent = 'true';
            }
            
            const year = document.createElement('div');
            year.className = 'node-year';
            year.textContent = data.year;
            
            const dotWrapper = document.createElement('div');
            dotWrapper.className = 'node-dot-wrapper';
            
            const dot = document.createElement('div');
            dot.className = 'node-dot';
            if (data.events.length === 0) {
                dot.classList.add('empty');
            }
            
            dotWrapper.appendChild(dot);
            
            node.appendChild(year);
            node.appendChild(dotWrapper);
            
            const cardsWrapper = document.createElement('div');
            cardsWrapper.className = 'node-cards';
            
            if (data.events.length > 0) {
                data.events.forEach((event, eventIndex) => {
                    const card = document.createElement('div');
                    card.className = 'node-card';
                    card.dataset.eventIndex = eventIndex;
                    
                    if (event.id) {
                        const image = document.createElement('img');
                        image.className = 'card-image';
                        image.alt = event.name;
                        image.loading = 'lazy';
                        image.onerror = function() {
                            this.style.display = 'none';
                        };
                        image.src = `/projects/manga_history/images/${event.id}.jpg`;
                        card.appendChild(image);
                    }
                    
                    const content = document.createElement('div');
                    content.className = 'card-content';
                    
                    const cardHeader = document.createElement('div');
                    cardHeader.className = 'card-header';
                    
                    const title = document.createElement('div');
                    title.className = 'card-title';
                    title.textContent = event.name;
                    
                    const date = document.createElement('div');
                    date.className = 'card-date';
                    date.textContent = event.author || event.date;
                    
                    cardHeader.appendChild(title);
                    cardHeader.appendChild(date);
                    
                    content.appendChild(cardHeader);
                    
                    card.appendChild(content);
                    
                    cardsWrapper.appendChild(card);
                });
            } else {
                const card = document.createElement('div');
                card.className = 'node-card empty-card';
                
                const emptyText = document.createElement('div');
                emptyText.className = 'empty-year-text';
                emptyText.textContent = `${data.year} 年`;
                card.appendChild(emptyText);
                
                cardsWrapper.appendChild(card);
            }
            
            node.appendChild(cardsWrapper);
            
            this.timelineNodes.appendChild(node);
        });
    }
    
    formatYear(dateStr) {
        const match = dateStr.match(/(\d+)/);
        return match ? match[1] : dateStr;
    }
    
    bindEvents() {
        this.timelineNodes.addEventListener('click', (e) => this.handleNodeClick(e));
        this.timelineNodes.addEventListener('mouseover', (e) => this.handleNodeHover(e));
        this.sidebarClose.addEventListener('click', () => this.hideSidebar());
        this.sidebarOverlay.addEventListener('click', () => this.hideSidebar());
    }
    
    handleNodeHover(e) {
        const card = e.target.closest('.node-card');
        if (!card) return;
        
        const node = card.closest('.timeline-node');
        if (!node) return;
        
        const cards = node.querySelectorAll('.node-card');
        cards.forEach(c => c.classList.remove('active-card'));
        card.classList.add('active-card');
    }
    
    handleNodeClick(e) {
        const card = e.target.closest('.node-card');
        if (!card) return;
        
        const node = card.closest('.timeline-node');
        if (!node) return;
        
        if (node.dataset.hasEvent !== 'true') return;
        
        const year = parseInt(node.dataset.year);
        const eventIndex = parseInt(card.dataset.eventIndex) || 0;
        
        const yearEvents = this.events.filter(ev => {
            const match = ev.date.match(/(\d+)/);
            return match && parseInt(match[1]) === year;
        });
        
        const event = yearEvents[eventIndex];
        if (!event) return;
        
        const cards = node.querySelectorAll('.node-card');
        cards.forEach(c => c.classList.remove('active-card'));
        card.classList.add('active-card');
        
        this.showSidebar(event, node);
    }
    
    showSidebar(event, node) {
        this.sidebarName.textContent = event.name;
        const finishDate = event.finish_date === 'now' ? '连载中' : event.finish_date;
        this.sidebarDate.textContent = `${event.date} ~ ${finishDate}`;
        this.sidebarAuthor.textContent = event.author || '';
        this.sidebarAuthor.style.display = event.author ? 'inline-flex' : 'none';
        this.sidebarDescription.textContent = event.description;
        
        if (event.id) {
            this.sidebarImage.alt = event.name;
            this.sidebarImage.style.display = 'block';
            this.sidebarImage.onerror = () => {
                this.sidebarImage.style.display = 'none';
            };
            this.sidebarImage.src = `/projects/manga_history/images/${event.id}.jpg`;
        } else {
            this.sidebarImage.style.display = 'none';
        }
        
        this.sidebar.classList.add('show');
        this.sidebarOverlay.classList.add('show');
        this.sidebarVisible = true;
        
        this.setActiveNode(node);
    }
    
    hideSidebar() {
        this.sidebar.classList.remove('show');
        this.sidebarOverlay.classList.remove('show');
        this.sidebarVisible = false;
        this.clearActiveNode();
    }
    
    setActiveNode(node) {
        if (this.currentNode) {
            this.currentNode.classList.remove('active');
            const cards = this.currentNode.querySelectorAll('.node-card');
            cards.forEach(c => c.classList.remove('active-card'));
        }
        this.currentNode = node;
        node.classList.add('active');
    }
    
    clearActiveNode() {
        if (this.currentNode) {
            this.currentNode.classList.remove('active');
            const cards = this.currentNode.querySelectorAll('.node-card');
            cards.forEach(c => c.classList.remove('active-card'));
            this.currentNode = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimelineApp();
});