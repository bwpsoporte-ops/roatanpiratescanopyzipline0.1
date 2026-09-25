'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Images, Maximize2, Move, Play, RotateCcw, X } from 'lucide-react';
import { Language, GalleryItem } from '@/lib/types';
import { translations } from '@/lib/translations';

interface GallerySectionProps {
  lang: Language;
  gallery: GalleryItem[];
}

type PhotoPosition = { x: number; y: number; z: number; rotation: number };

export function GallerySection({ lang, gallery }: GallerySectionProps) {
  const t = translations[lang];
  const boardRef = useRef<HTMLDivElement>(null);
  const zIndexRef = useRef(20);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number; startX: number; startY: number; moved: boolean } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [positions, setPositions] = useState<Record<string, PhotoPosition>>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t.gallery.all },
    { key: 'tirolesas', label: t.gallery.ziplines },
    { key: 'plataformas', label: t.gallery.platforms },
    { key: 'visitantes', label: t.gallery.visitors },
    { key: 'paisajes', label: t.gallery.landscapes },
    { key: 'guias', label: t.gallery.guides },
    { key: 'instalaciones', label: t.gallery.facilities },
    { key: 'videos', label: t.gallery.videos }
  ];

  const filteredItems = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'videos') return item.type === 'video';
    return item.category === selectedCategory;
  });
  const displayedItems = filteredItems.slice(0, visibleCount);
  const activeIndex = activeItemId ? filteredItems.findIndex((item) => item.id === activeItemId) : -1;
  const activeItem = activeIndex >= 0 ? filteredItems[activeIndex] : null;

  const organizePhotos = () => {
    const board = boardRef.current;
    if (!board) return;
    const width = board.clientWidth;
    const height = board.clientHeight;
    const isMobile = width < 640;
    const cardWidth = isMobile ? Math.min(320, width - 24) : width < 900 ? 230 : 270;
    const cardHeight = isMobile ? 270 : 215;
    const gapX = isMobile ? 0 : 22;
    const columns = isMobile ? 1 : Math.max(2, Math.floor((width - 36) / (cardWidth + gapX)));
    const nextPositions: Record<string, PhotoPosition> = {};

    displayedItems.forEach((item, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const rowStep = isMobile ? Math.max(78, (height - cardHeight - 36) / Math.max(1, displayedItems.length - 1)) : Math.max(138, Math.min(cardHeight + 18, (height - cardHeight - 30) / Math.max(1, Math.ceil(displayedItems.length / columns) - 1)));
      const baseX = isMobile ? (width - cardWidth) / 2 + ((index % 3) - 1) * 10 : 18 + column * (cardWidth + gapX);
      const baseY = 18 + row * rowStep;
      nextPositions[item.id] = {
        x: Math.max(8, Math.min(width - cardWidth - 8, baseX + (row % 2 ? 9 : 0))),
        y: Math.max(8, Math.min(height - cardHeight - 8, baseY)),
        z: index + 1,
        rotation: isMobile ? ((index % 3) - 1) * 1.2 : ((index % 5) - 2) * 0.7
      };
    });
    zIndexRef.current = displayedItems.length + 20;
    setPositions(nextPositions);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(organizePhotos);
    const handleResize = () => organizePhotos();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, visibleCount, gallery.length]);

  const bringToFront = (id: string) => {
    zIndexRef.current += 1;
    setPositions((current) => ({ ...current, [id]: { ...(current[id] || { x: 12, y: 12, rotation: 0 }), z: zIndexRef.current } }));
  };

  const startDrag = (event: React.PointerEvent, item: GalleryItem) => {
    const board = boardRef.current;
    const position = positions[item.id];
    if (!board || !position) return;
    const bounds = board.getBoundingClientRect();
    bringToFront(item.id);
    dragRef.current = { id: item.id, offsetX: event.clientX - bounds.left - position.x, offsetY: event.clientY - bounds.top - position.y, startX: event.clientX, startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePhoto = (event: React.PointerEvent) => {
    const board = boardRef.current;
    const drag = dragRef.current;
    if (!board || !drag) return;
    const bounds = board.getBoundingClientRect();
    const isMobile = bounds.width < 640;
    const cardWidth = isMobile ? Math.min(320, bounds.width - 24) : bounds.width < 900 ? 230 : 270;
    const cardHeight = isMobile ? 270 : 215;
    const x = Math.max(6, Math.min(bounds.width - cardWidth - 6, event.clientX - bounds.left - drag.offsetX));
    const y = Math.max(6, Math.min(bounds.height - cardHeight - 6, event.clientY - bounds.top - drag.offsetY));
    if (Math.abs(event.clientX - drag.startX) > 5 || Math.abs(event.clientY - drag.startY) > 5) drag.moved = true;
    setPositions((current) => ({ ...current, [drag.id]: { ...current[drag.id], x, y } }));
  };

  const finishDrag = (event: React.PointerEvent, item: GalleryItem) => {
    const wasMoved = dragRef.current?.moved;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!wasMoved) setActiveItemId(item.id);
  };

  const showPrevious = () => {
    if (!filteredItems.length || activeIndex < 0) return;
    setActiveItemId(filteredItems[(activeIndex - 1 + filteredItems.length) % filteredItems.length].id);
  };

  const showNext = () => {
    if (!filteredItems.length || activeIndex < 0) return;
    setActiveItemId(filteredItems[(activeIndex + 1) % filteredItems.length].id);
  };

  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(10);
    setActiveItemId(null);
  };

  useEffect(() => {
    if (!activeItemId) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveItemId(null);
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <section id="galeria" className="adventure-gallery" aria-labelledby="gallery-heading">
      <div className="adventure-gallery-header">
        <div>
          <span className="adventure-gallery-kicker"><Images className="h-4 w-4" />{t.gallery.badge}</span>
          <h2 id="gallery-heading">{lang === 'es' ? 'Explora. Mueve. Vive Roatán.' : 'Explore. Move. Experience Roatan.'}</h2>
          <p>{lang === 'es' ? 'Arrastra las fotografías para explorar nuestros mejores momentos y presiónalas para verlas en grande.' : 'Drag the photographs to explore our best moments, then press one to see it full size.'}</p>
        </div>
        <div className="adventure-gallery-actions">
          <button type="button" onClick={organizePhotos}><RotateCcw className="h-4 w-4" />{lang === 'es' ? 'Ordenar fotos' : 'Organize photos'}</button>
          <Link href="/reservar">{lang === 'es' ? 'Reservar aventura' : 'Book adventure'}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>

      <div className="adventure-gallery-filters" aria-label={lang === 'es' ? 'Categorías de galería' : 'Gallery categories'}>
        {categories.map((category) => <button key={category.key} type="button" onClick={() => changeCategory(category.key)} className={selectedCategory === category.key ? 'is-active' : ''}>{category.label}</button>)}
      </div>

      <div ref={boardRef} className="adventure-photo-board" style={{ '--gallery-mobile-height': `${Math.max(84, 48 + displayedItems.length * 5.5)}rem` } as React.CSSProperties}>
        <div className="adventure-board-note"><Move className="h-4 w-4" /><span>{lang === 'es' ? 'Arrastra para mover · Presiona para abrir' : 'Drag to move · Press to open'}</span></div>
        {displayedItems.map((item) => {
          const position = positions[item.id];
          if (!position) return null;
          return (
            <article key={item.id} className="adventure-photo-card" style={{ left: position.x, top: position.y, zIndex: position.z, transform: `rotate(${position.rotation}deg)` }} onPointerDown={(event) => startDrag(event, item)} onPointerMove={movePhoto} onPointerUp={(event) => finishDrag(event, item)} onPointerCancel={() => { dragRef.current = null; }}>
              <div className="adventure-photo-image">
                <Image src={item.imageUrl} alt={item.title[lang]} fill sizes="(max-width: 640px) 320px, 270px" className="object-cover" draggable={false} referrerPolicy="no-referrer" />
                <div className="adventure-photo-shade" />
                {item.type === 'video' && <span className="adventure-video-mark"><Play className="h-4 w-4 fill-current" /></span>}
                <span className="adventure-expand-mark"><Maximize2 className="h-3.5 w-3.5" /></span>
              </div>
              <div className="adventure-photo-caption"><span>{item.category}</span><strong>{item.title[lang]}</strong></div>
            </article>
          );
        })}
        {!displayedItems.length && <div className="adventure-gallery-empty">{lang === 'es' ? 'Todavía no hay contenido en esta categoría.' : 'There is no content in this category yet.'}</div>}
      </div>

      {visibleCount < filteredItems.length && <div className="adventure-load-more"><button type="button" onClick={() => setVisibleCount((count) => Math.min(count + 6, filteredItems.length))}>{lang === 'es' ? 'Mostrar más fotografías' : 'Show more photographs'}<span>{visibleCount} / {filteredItems.length}</span></button></div>}

      {activeItem && (
        <div id="gallery-lightbox" className="adventure-lightbox" role="dialog" aria-modal="true" aria-label={activeItem.title[lang]}>
          <button type="button" className="adventure-lightbox-close" onClick={() => setActiveItemId(null)} aria-label={lang === 'es' ? 'Cerrar' : 'Close'}><X className="h-5 w-5" /></button>
          <button type="button" className="adventure-lightbox-arrow is-left" onClick={showPrevious} aria-label={lang === 'es' ? 'Anterior' : 'Previous'}><ChevronLeft className="h-6 w-6" /></button>
          <div className="adventure-lightbox-panel">
            <div className="adventure-lightbox-media">
              {activeItem.type === 'video' && activeItem.videoUrl ? <video src={activeItem.videoUrl} controls autoPlay className="h-full w-full object-contain" /> : <Image src={activeItem.imageUrl} alt={activeItem.title[lang]} fill sizes="95vw" className="object-contain" priority referrerPolicy="no-referrer" />}
            </div>
            <div className="adventure-lightbox-info">
              <div><span>{activeItem.category}</span><h3>{activeItem.title[lang]}</h3><p>{activeIndex + 1} / {filteredItems.length}</p></div>
              <Link href="/reservar">{lang === 'es' ? 'Quiero vivir esta aventura' : 'I want this adventure'}<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <button type="button" className="adventure-lightbox-arrow is-right" onClick={showNext} aria-label={lang === 'es' ? 'Siguiente' : 'Next'}><ChevronRight className="h-6 w-6" /></button>
        </div>
      )}
    </section>
  );
}
