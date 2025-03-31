import { initMap } from './map.js';
import { renderCharts } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    // إدارة القائمة على جميع الصفحات
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.matches('.menu-icon')) {
                navLinks.classList.remove('active');
            }
        });

        // إغلاق القائمة عند تغيير حجم الشاشة
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
            }
        });
    }

    // تهيئة المكونات حسب الصفحة
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'map.html') initMap();
    if (currentPage === 'statistics.html') renderCharts();
});