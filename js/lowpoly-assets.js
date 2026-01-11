document.addEventListener('DOMContentLoaded', () => {
        const formatClock = (value) => {
                const safe = Math.max(0, Math.floor(value || 0));
                const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
                const seconds = String(safe % 60).padStart(2, '0');
                return `${minutes}:${seconds}`;
        };

        document.querySelectorAll('.asset-stack .asset').forEach(asset => {
                const video = asset.querySelector('video');
                const scrubber = asset.querySelector('.scrubber');
                const elapsed = asset.querySelector('.elapsed');
                const remaining = asset.querySelector('.remaining');
                const playToggle = asset.querySelector('.play-toggle');

                if (!video || !scrubber || !elapsed || !remaining) return;

                const syncPlayToggle = () => {
                        if (!playToggle) return;
                        if (video.paused) {
                                playToggle.textContent = '\u25B6'; // ▶
                                playToggle.setAttribute('aria-label', 'Play video');
                        } else {
                                playToggle.textContent = '\u275A\u275A'; // ❚❚
                                playToggle.setAttribute('aria-label', 'Pause video');
                        }
                };

                const updateUI = () => {
                        if (!video.duration || Number.isNaN(video.duration)) return;
                        const duration = video.duration;
                        const current = video.currentTime;
                        const percent = Math.min(Math.max((current / duration) * 100, 0), 100);
                        scrubber.value = percent;
                        elapsed.textContent = formatClock(current);
                        remaining.textContent = `/${formatClock(duration)}`;
                        syncPlayToggle();
                };

                let rafId = null;
                const startTicker = () => {
                        if (rafId) return;
                        const step = () => {
                                updateUI();
                                if (!video.paused && !video.ended) {
                                        rafId = requestAnimationFrame(step);
                                } else {
                                        rafId = null;
                                }
                        };
                        rafId = requestAnimationFrame(step);
                };

                const stopTicker = () => {
                        if (rafId) {
                                cancelAnimationFrame(rafId);
                                rafId = null;
                        }
                };

                video.addEventListener('loadedmetadata', () => {
                        scrubber.disabled = !video.duration || Number.isNaN(video.duration);
                        updateUI();
                });

                // Fallback updates
                video.addEventListener('timeupdate', updateUI);

                scrubber.addEventListener('input', () => {
                        if (!video.duration || Number.isNaN(video.duration)) return;
                        const newTime = (scrubber.value / 100) * video.duration;
                        video.currentTime = newTime;
                        if (video.paused) updateUI();
                });

                if (playToggle) {
                        playToggle.addEventListener('click', (event) => {
                                event.stopPropagation();
                                if (video.paused) {
                                        video.play();
                                        asset.classList.remove('paused');
                                } else {
                                        video.pause();
                                        asset.classList.add('paused');
                                }
                                syncPlayToggle();
                        });
                }

                asset.addEventListener('click', (event) => {
                        if (event.target === scrubber || event.target === playToggle) return;
                        if (video.paused) {
                                video.play();
                                asset.classList.remove('paused');
                        } else {
                                video.pause();
                                asset.classList.add('paused');
                        }
                        syncPlayToggle();
                });

                video.addEventListener('play', () => {
                        syncPlayToggle();
                        startTicker();
                });

                video.addEventListener('pause', () => {
                        syncPlayToggle();
                        stopTicker();
                });
        });
});
