import { Template } from './types';

const overwatchCSS = `
/* Overwatch Patch Notes Template - Light Theme */
/* Based on authentic styles from https://overwatch.blizzard.com/en-us/news/patch-notes/ */

.overwatch-template {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  background-color: #ffffff;
  color: #1d253a;
  padding: 2rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography */
.overwatch-template h1 {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 39px;
  text-transform: uppercase;
  color: #1d253a;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
}

@media (min-width: 960px) {
  .overwatch-template h1 {
    font-size: 60px;
    line-height: 66px;
  }
}

.overwatch-template h2 {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1d253a;
  margin-top: 0;
  margin-bottom: 0.5rem;
  text-align: center;
}

@media (min-width: 720px) {
  .overwatch-template h2 {
    font-size: 28px;
  }
}

/* Patch title (H3 in the original) */
.overwatch-template h3 {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1d253a;
  margin-bottom: 10px;
  border-bottom: none;
  padding-bottom: 0;
}

@media (min-width: 1200px) {
  .overwatch-template h3 {
    font-size: 36px;
  }
}

/* Section title (H4 in the original) */
.overwatch-template h4 {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1d253a;
  margin-bottom: 10px;
  margin-top: 1.5rem;
}

/* Hero name (H5 in the original) */
.overwatch-template h5 {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 21px;
  text-transform: uppercase;
  color: #1d253a;
  margin: 0;
}

@media (min-width: 1200px) {
  .overwatch-template h5 {
    font-size: 21px;
    line-height: 25px;
  }
}

@media (min-width: 1400px) {
  .overwatch-template h5 {
    font-size: 24px;
    line-height: 27px;
  }
}

/* Body text */
.overwatch-template p {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333d47;
  margin-bottom: 1rem;
  line-height: 1.5;
}

@media (min-width: 720px) {
  .overwatch-template p {
    font-size: 20px;
  }
}

/* Lists */
.overwatch-template ul {
  list-style-type: disc;
  padding-left: 40px;
  margin-bottom: 1rem;
}

.overwatch-template ul li {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333d47;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

@media (min-width: 720px) {
  .overwatch-template ul li {
    font-size: 20px;
  }
}

/* Nested lists */
.overwatch-template ul ul {
  list-style-type: circle;
  padding-left: 20px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Links */
.overwatch-template a {
  color: #f06414;
  text-decoration: underline;
}

.overwatch-template a:hover {
  color: #ff7926;
}

/* Strong and emphasis */
.overwatch-template strong {
  font-weight: 700;
  color: #1d253a;
}

.overwatch-template em {
  font-style: italic;
  color: #333d47;
}

/* Code */
.overwatch-template code {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  background-color: #f2f2f2;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.overwatch-template pre {
  background-color: #f2f2f2;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.overwatch-template pre code {
  background-color: transparent;
  padding: 0;
  font-size: 14px;
}

/* Blockquote */
.overwatch-template blockquote {
  border-left: 5px solid #ffab2e;
  padding-left: 15px;
  font-style: italic;
  color: #555555;
  margin: 15px 0;
  background-color: #fafafa;
  padding: 10px 15px;
  border-radius: 0 4px 4px 0;
}

/* Tables */
.overwatch-template table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  font-size: 16px;
}

.overwatch-template th,
.overwatch-template td {
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 15px;
  text-align: left;
}

.overwatch-template th {
  background-color: #f2f2f2;
  font-weight: 700;
  color: #1d253a;
}

.overwatch-template tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Horizontal rule */
.overwatch-template hr {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  margin: 2rem 0;
}

/* Images */
.overwatch-template img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Special Overwatch classes */
.overwatch-template .patch-date {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #686868;
  text-transform: uppercase;
  margin-bottom: 5px;
}

@media (min-width: 720px) {
  .overwatch-template .patch-date {
    font-size: 20px;
  }
}

.overwatch-template .section-description {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333d47;
  margin-bottom: 1rem;
}

@media (min-width: 720px) {
  .overwatch-template .section-description {
    font-size: 20px;
  }
}

.overwatch-template .dev-notes {
  border-left: 5px solid #ffab2e;
  font-weight: 500;
  padding-left: 15px;
  font-style: italic;
  color: #555555;
  margin: 15px 0;
  background-color: #fafafa;
  padding: 10px 15px;
  border-radius: 0 4px 4px 0;
}

.overwatch-template .hero-card {
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  margin-top: 50px;
  background: #ffffff;
}

.overwatch-template .hero-card-header {
  background-color: #f2f2f2;
  padding: 15px 10px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.overwatch-template .hero-card-body {
  padding: 5px 20px;
}

.overwatch-template .ability-update {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.overwatch-template .ability-icon {
  background-color: hsla(223, 4%, 62%, 0.5);
  border: 2px solid hsla(0, 0%, 100%, 0.6);
  border-radius: 2px;
  height: 40px;
  min-width: 40px;
  width: 40px;
  position: relative;
  margin-right: 10px;
}

@media (min-width: 960px) {
  .overwatch-template .ability-icon {
    height: 45px;
    min-width: 45px;
    width: 45px;
  }
}

.overwatch-template .ability-name {
  font-weight: 700;
  margin-bottom: 5px;
}

/* Layout */
.overwatch-template .content-container {
  max-width: 750px;
  padding: 0 10px;
}

@media (min-width: 960px) {
  .overwatch-template .content-container {
    padding: 0 20px;
  }
}

@media (min-width: 1200px) {
  .overwatch-template .content-container {
    display: inline-block;
    margin-right: 50px;
    padding: 0;
    width: 750px;
  }
}

/* Section spacing */
.overwatch-template .patch-section {
  margin: 35px 0;
}

.overwatch-template .patch-entry {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-bottom: 30px;
  padding-top: 30px;
}

@media (min-width: 1200px) {
  .overwatch-template .patch-entry {
    padding-bottom: 50px;
  }
}

.overwatch-template .patch-entry:last-child {
  border-bottom: none;
}

/* General update items */
.overwatch-template .general-update-title {
  font-family: "Config", "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin: 10px 0;
  color: #1d253a;
}

@media (min-width: 720px) {
  .overwatch-template .general-update-title {
    font-size: 20px;
  }
}

/* Top of post button */
.overwatch-template .top-of-post {
  display: inline-block;
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: #f2f2f2;
  color: #1d253a;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.overwatch-template .top-of-post:hover {
  background-color: #e6e6e6;
}
`;

export const overwatchTemplate: Template = {
  id: 'overwatch',
  name: 'Overwatch Patch Notes',
  description: 'Light-themed template based on authentic Overwatch patch notes style',
  preview: 'White background with dark navy text, orange accents, and professional typography',
  css: overwatchCSS,
  author: 'md2img',
  version: '1.0.0'
};

export const defaultTemplates: Template[] = [
  overwatchTemplate
];

export function getTemplate(id: string): Template | undefined {
  if (!id || typeof id !== 'string') {
    return undefined;
  }
  return defaultTemplates.find(t => t.id === id);
}

export function getAllTemplates(): Template[] {
  return [...defaultTemplates];
}
