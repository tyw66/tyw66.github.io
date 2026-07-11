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
        this.sidebarTags = document.getElementById('sidebarTags');
        
        this.filterSelectWrapper = document.getElementById('filterSelectWrapper');
        this.filterInput = document.getElementById('filterInput');
        this.filterDropdown = document.getElementById('filterDropdown');
        this.filterDropdownContent = document.getElementById('filterDropdownContent');
        this.filterCount = document.getElementById('filterCount');
        this.filterClear = document.getElementById('filterClear');
        
        this.sourceSelect = document.getElementById('sourceSelect');
        
        this.dataSources = [
            { label: '日本漫画史', path: 'manga' },
            { label: '日本战国史', path: 'sengoku' }
        ];
        
        this.events = [];
        this.currentNode = null;
        this.sidebarVisible = false;
        this.filterDropdownOpen = false;
        this.selectedTag = null;
        this.tagCounts = {};
        this.currentSource = this.getSavedSource();
        
        this.init();
    }
    
    async init() {
        this.renderSourceOptions();
        await this.loadEvents();
        this.buildTagCounts();
        this.renderFilterDropdown();
        this.renderTimeline();
        this.bindEvents();
    }
    
    getSavedSource() {
        const saved = localStorage.getItem('timelineSource');
        if (saved) {
            const exists = this.dataSources.some(s => s.path === saved);
            if (exists) return saved;
        }
        return this.dataSources[0].path;
    }
    
    saveSource(sourcePath) {
        localStorage.setItem('timelineSource', sourcePath);
    }
    
    renderSourceOptions() {
        this.sourceSelect.innerHTML = '';
        this.dataSources.forEach(source => {
            const option = document.createElement('option');
            option.value = source.path;
            option.textContent = source.label;
            if (source.path === this.currentSource) {
                option.selected = true;
            }
            this.sourceSelect.appendChild(option);
        });
    }
    
    async loadEvents() {
        try {
            const response = await fetch(`${this.currentSource}/data.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.events = data.content || data;
            
            if (data.title) {
                const h1 = document.querySelector('header h1');
                if (h1) h1.textContent = data.title;
                //document.title = data.title;
            }
            
            if (data.description) {
                const subtitle = document.querySelector('header .subtitle');
                if (subtitle) subtitle.textContent = data.description;
            }
        } catch (error) {
            console.error('Failed to load events:', error);
            this.events = this.getDefaultEvents();
        }
    }
    
    getDefaultEvents() {
        return [
            { name: '示例条目1', date: '2000-01-01', description: '这是一个示例条目描述。' },
            { name: '示例条目2', date: '2010-06-15', description: '这是另一个示例条目描述。' },
            { name: '示例条目3', date: '2020-12-25', description: '这是第三个示例条目描述。' }
        ];
    }
    
    buildTagCounts() {
        this.tagCounts = {};
        
        this.events.forEach(event => {
            const tags = Array.isArray(event.tag) ? event.tag : (event.tag ? [event.tag] : []);
            tags.forEach(tag => {
                if (!this.tagCounts[tag]) {
                    this.tagCounts[tag] = 0;
                }
                this.tagCounts[tag]++;
            });
        });
    }
    
    renderFilterDropdown() {
        const tags = Object.keys(this.tagCounts).sort((a, b) => {
            return this.tagCounts[b] - this.tagCounts[a];
        });
        
        this.filterCount.textContent = `${tags.length} 个标签`;
        this.filterDropdownContent.innerHTML = '';
        
        tags.forEach(tag => {
            const count = this.tagCounts[tag];
            const item = document.createElement('div');
            item.className = 'filter-item';
            if (this.selectedTag === tag) {
                item.classList.add('active');
            }
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'filter-item-name';
            nameSpan.textContent = tag;
            
            const countSpan = document.createElement('span');
            countSpan.className = 'filter-item-count';
            countSpan.textContent = `(${count})`;
            
            item.appendChild(nameSpan);
            item.appendChild(countSpan);
            
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectTag(tag);
            });
            
            this.filterDropdownContent.appendChild(item);
        });
    }
    
    toggleFilterDropdown() {
        this.filterDropdownOpen = !this.filterDropdownOpen;
        if (this.filterDropdownOpen) {
            this.filterSelectWrapper.classList.add('open');
        } else {
            this.filterSelectWrapper.classList.remove('open');
        }
    }
    
    closeFilterDropdown() {
        this.filterDropdownOpen = false;
        this.filterSelectWrapper.classList.remove('open');
    }
    
    selectTag(tag) {
        this.selectedTag = tag;
        this.filterInput.value = tag;
        this.filterInput.classList.add('has-value');
        this.filterClear.style.display = 'flex';
        
        this.renderFilterDropdown();
        this.closeFilterDropdown();
        this.filterTimelineByTag(tag);
    }
    
    clearFilter() {
        this.selectedTag = null;
        this.filterInput.value = '';
        this.filterInput.classList.remove('has-value');
        this.filterClear.style.display = 'none';
        
        this.renderFilterDropdown();
        this.filterTimelineByTag(null);
    }
    
    filterTimelineByTag(tag) {
        const nodes = this.timelineNodes.querySelectorAll('.timeline-node');
        
        nodes.forEach(node => {
            const hasEvent = node.dataset.hasEvent === 'true';
            
            if (!hasEvent) {
                node.style.display = tag ? 'none' : 'flex';
                return;
            }
            
            const cards = node.querySelectorAll('.node-card');
            let visibleCardCount = 0;
            
            cards.forEach(card => {
                if (!tag) {
                    card.style.display = 'flex';
                    visibleCardCount++;
                } else {
                    const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
                    if (cardTags.includes(tag)) {
                        card.style.display = 'flex';
                        visibleCardCount++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            node.style.display = visibleCardCount > 0 ? 'flex' : 'none';
        });
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
        
        const years = Array.from(eventMap.keys());
        const minYear = years.length > 0 ? Math.min(...years) - 5 : 1945;
        const maxYear = years.length > 0 ? Math.max(...years) + 5 : 2045;
        
        for (let year = minYear; year <= maxYear; year++) {
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
                    const tags = Array.isArray(event.tag) ? event.tag : (event.tag ? [event.tag] : []);
                    card.dataset.tags = tags.join(',');
                    
                    if (event.id) {
                        const image = document.createElement('img');
                        image.className = 'card-image';
                        image.alt = event.name;
                        image.loading = 'lazy';
                        image.onerror = function() {
                            this.style.display = 'none';
                        };
                        image.src = `${this.currentSource}/${event.id}.jpg`; 
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
                    const author = Array.isArray(event.tag) ? event.tag[0] : event.tag;
                    date.textContent = author || event.date;
                    
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
        
        this.filterSelectWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFilterDropdown();
        });
        
        this.filterClear.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearFilter();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.filterSelectWrapper.contains(e.target)) {
                this.closeFilterDropdown();
            }
        });
        
        this.sourceSelect.addEventListener('change', (e) => {
            this.switchSource(e.target.value);
        });
    }
    
    async switchSource(sourcePath) {
        this.currentSource = sourcePath;
        this.saveSource(sourcePath);
        this.hideSidebar();
        this.clearFilter();
        await this.loadEvents();
        this.buildTagCounts();
        this.renderFilterDropdown();
        this.renderTimeline();
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
        const finishDate = event.date_end === 'now' ? '至今' : event.date_end;
        this.sidebarDate.textContent = `${event.date} ~ ${finishDate}`;
        
        const tags = Array.isArray(event.tag) ? event.tag : (event.tag ? [event.tag] : []);
        this.sidebarAuthor.textContent = tags.length > 0 ? tags[0] : '';
        this.sidebarAuthor.style.display = tags.length > 0 ? 'inline-flex' : 'none';
        
        this.sidebarTags.innerHTML = '';
        if (tags.length > 1) {
            this.sidebarTags.style.display = 'flex';
            tags.slice(1).forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'sidebar-tag';
                tagEl.textContent = tag;
                this.sidebarTags.appendChild(tagEl);
            });
        } else {
            this.sidebarTags.style.display = 'none';
        }
        
        this.sidebarDescription.textContent = event.description;
        
        if (event.id) {
            this.sidebarImage.alt = event.name;
            this.sidebarImage.style.display = 'block';
            this.sidebarImage.onerror = () => {
                this.sidebarImage.style.display = 'none';
            };
            this.sidebarImage.src = `${this.currentSource}/${event.id}.jpg`; 
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