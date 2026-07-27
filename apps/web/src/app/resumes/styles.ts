export const styles = `
    @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
        .resume-container {
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        }
        .resume-page { padding: 0 !important; }
    }

    .resume-page {
        padding: 1rem;
    }

    @media (min-width: 768px) {
        .resume-page {
            padding: 2rem;
        }
    }

    .resume-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid var(--color-border, hsl(240 5.9% 90%));
    }

    .resume-header-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .resume-avatar {
        width: 4rem;
        height: 4rem;
        flex-shrink: 0;
    }

    .resume-name {
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 1.2;
    }

    .resume-email {
        font-size: 0.875rem;
        color: hsl(240 3.8% 46.1%);
        margin-top: 0.25rem;
    }

    .resume-position {
        text-align: right;
        flex-shrink: 0;
    }

    .resume-position-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: hsl(240 3.8% 46.1%);
    }

    .resume-position-title {
        font-size: 1rem;
        font-weight: 600;
        margin-top: 0.125rem;
        text-decoration: underline;
        color: var(--color-brand);
    }

    .resume-body {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-top: 1.5rem;
    }

    .resume-section-title {
        font-size: 0.8125rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: hsl(240 3.8% 46.1%);
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--color-border, hsl(240 5.9% 90%));
        margin-bottom: 0.75rem;
    }

    .resume-attribute-list {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }

    .resume-attribute-row {
        display: flex; 
        padding-top: 0.5rem;
        padding-bottom: 0.5rem; 
        flex-direction: column; 
        gap: 0.5rem; 
        border-radius: 0.5rem; 
    }

    @media (min-width: 768px) {
        .resume-attribute-row {
            flex-direction: row; 
            gap: 1rem; 
            align-items: flex-start; 
        }
    }

    .resume-attribute-name {
        font-size: 0.8125rem;
        font-weight: 500;
        color: hsl(240 3.8% 46.1%);
        display: flex; 
        gap: 0.5rem; 
        align-items: center; 
    }

    
    @media (min-width: 768px) {
        .resume-attribute-name {
            shrink: 0; 
            width: 12rem; 
        }
    }

    .resume-attribute-value {
        min-width: 0px;
        flex: 1;
        font-size: 0.875rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
    }

    @media (min-width: 768px) {
        .resume-attribute-meta {
            shrink: 0; 
            width: 7rem; 
        }
    }

    @media (max-width: 640px) {
        .resume-header {
            flex-direction: column;
        }
        .resume-position {
            text-align: left;
        }
        .resume-attribute-row {
            grid-template-columns: 1fr;
            gap: 0.125rem;
        }
    }

    .resume-projects {
        margin-top: 1rem;
    }
    .resume-projects-placeholder {
        padding-top: 1rem;
        padding-bottom: 1rem; 
        font-size: 0.875rem;
        line-height: 1.25rem; 
        text-align: center;
    }

    .resume-projects-list *:not(:first) {
        margin-top: 1rem;
    }
    
    .resume-projects-list__item {
        display: flex; 
        gap: 1rem; 
        align-items: flex-start; 
    }

    .resume-projects-list__image {
        object-fit: cover; 
        shrink: 0; 
        border-radius: 0.5rem;
    }
    .resume-projects-list__item-content {
        flex: 1;
        min-width: 0px;
    }
    .resume-projects-list__title-container {
        display: flex; 
        gap: 0.5rem; 
        align-items: center; 
    }
    .resume-projects-list__title {
        font-size: 0.875rem;
        line-height: 1.25rem; 
        font-weight: 500; 
    }
    .resume-projects-list__link {
        color: var(--color-muted-foreground);
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms; 
    }
    .resume-projects-list__link:hover {
        color: var(--color-foreground);
    }
`;
