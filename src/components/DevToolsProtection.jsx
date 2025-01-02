import { useEffect, useRef } from 'react';

const DevToolsProtection = () => {
    const intervalRef = useRef(null);

    useEffect(() => {
        let isDevToolsOpen = false;

        function handleDevToolsOpen() {
            if (!isDevToolsOpen) {
                isDevToolsOpen = true;
                try {
                    window.location.href = 'about:blank';
                } catch (e) {
                    window.location.reload();
                }
            }
        }

        function detectDevTools() {
            // Method 1: Size detection
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            // Method 2: Position detection
            const isDevToolsUndocked = 
                window.screenY < -20 || 
                window.screenX < -20 ||
                (window.outerHeight + window.screenY) > window.screen.height;

            if (widthThreshold || heightThreshold || isDevToolsUndocked) {
                handleDevToolsOpen();
                return true;
            }

            return false;
        }

        function preventDevTools() {
            // 1. Prevent only developer tools keyboard shortcuts
            window.addEventListener('keydown', (e) => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDevToolsOpen();
                    return false;
                }
            }, true);

            // 2. Prevent right-click
            window.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);

            // 3. Monitor window size changes
            window.addEventListener('resize', detectDevTools);

            // 4. Monitor window position
            window.addEventListener('mousemove', () => {
                if (window.screenY < -20 || window.screenX < -20) {
                    handleDevToolsOpen();
                }
            });

            // 5. Debugger-based detection
            setInterval(() => {
                const start = performance.now();
                debugger;
                const end = performance.now();
                if (end - start > 100) {
                    handleDevToolsOpen();
                }
            }, 1000);

            // 6. Regular detection interval
            intervalRef.current = setInterval(detectDevTools, 1000);
        }

        // Initialize protection
        preventDevTools();

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            window.removeEventListener('resize', detectDevTools);
        };
    }, []);

    return null;
};

export default DevToolsProtection;
