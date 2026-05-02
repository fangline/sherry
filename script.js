AOS.init({ duration: 1200, once: false });

// 時間軸邏輯
const scrollContainer = document.getElementById('timelineScroll');
const items = document.querySelectorAll('.timeline-item');
const progress = document.getElementById('timelineProgress');
const dots = document.querySelectorAll('.timeline-dot');

function updateTimelineUI() {
    const scrollLeft = scrollContainer.scrollLeft;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
    const percentage = maxScroll === 0 ? 0 : (scrollLeft / maxScroll) * 100;
    progress.style.width = percentage + '%';

    const containerCenter = scrollLeft + (scrollContainer.offsetWidth / 2);
    let activeIdx = 0;
    let minDiff = Infinity;
    items.forEach((item, idx) => {
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        const diff = Math.abs(containerCenter - itemCenter);
        if (diff < minDiff) { minDiff = diff; activeIdx = idx; }
    });
    dots.forEach((dot, idx) => {
        if (idx === activeIdx) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function moveTimeline(direction) {
    const currentIdx = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
    let targetIdx = currentIdx + direction;
    if (targetIdx < 0) targetIdx = 0;
    if (targetIdx >= items.length) targetIdx = items.length - 1;
    scrollToItem(targetIdx);
}

function scrollToItem(index) {
    const targetItem = items[index];
    if (!targetItem) return;
    scrollContainer.scrollTo({
        left: targetItem.offsetLeft - (scrollContainer.offsetWidth / 2) + (targetItem.offsetWidth / 2),
        behavior: 'smooth'
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'));
        scrollToItem(idx);
    });
});

scrollContainer.addEventListener('scroll', updateTimelineUI);

// 作品跳轉邏輯
function viewProject(title, desc, img) {
    document.getElementById('detailTitle').innerText = title;
    document.getElementById('detailDesc').innerText = desc;
    document.getElementById('detailImg').src = img + "?auto=format&fit=crop&q=80&w=1200";
    
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('projectDetailView').style.display = 'block';
    window.scrollTo(0, 0);
}

function closeProject() {
    document.getElementById('projectDetailView').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('portfolio').scrollIntoView();
}

// 平滑滾動導覽
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 聯絡資訊彈窗邏輯
function toggleContactModal(show) {
    const modal = document.getElementById('contactModal');
    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

document.getElementById('contactModal').addEventListener('click', function(e) {
    if (e.target === this) toggleContactModal(false);
});

window.addEventListener('load', updateTimelineUI);