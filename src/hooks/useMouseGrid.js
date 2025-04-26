import {useRef, useEffect} from "react";

const useMouseGrid = ({rows, cols, areaRef}) => {
    const mousePos = useRef({x: 0, y: 0});

    useEffect(() => {
        const handle = (e) => (mousePos.current = {x: e.clientX, y: e.clientY});
        window.addEventListener("mousemove", handle);
        return () => window.removeEventListener("mousemove", handle);
    }, []);

    const mapToCell = () => {
        if (!areaRef.current) return 0;
        const area = areaRef.current.getBoundingClientRect();
        const xRel = mousePos.current.x - area.left;
        const yRel = mousePos.current.y - area.top;
        const cellW = area.width / cols;
        const cellH = area.height / rows;
        const col = Math.min(cols - 1, Math.max(0, Math.floor(xRel / cellW)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor(yRel / cellH)));
        return row * cols + col + 1; 
    };

    return mapToCell;
}

export default useMouseGrid;