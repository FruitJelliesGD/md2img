# Overwatch Template Usage Guide

## Overview
The Overwatch template replicates the authentic style of the Overwatch patch notes website. This guide shows how to use each CSS class in your Markdown files.

## Basic Structure

### Patch Entry
```html
<div class="patch-entry">
  <div class="patch-date">April 28, 2026</div>
  <h3>Overwatch Retail Patch Notes – April 28, 2026</h3>
  <!-- Content here -->
</div>
```

### Section with Title
```html
<div class="patch-section">
  <h4>Bug Fixes</h4>
  <!-- Section content -->
</div>
```

## Hero Updates

### Hero Card with Ability Updates
```html
<div class="hero-card">
  <div class="hero-card-header">
    <h5>Roadhog</h5>
  </div>
  <div class="hero-card-body">
    <div class="ability-update">
      <div class="ability-icon"></div>
      <div class="ability-text">
        <div class="ability-name">Chain Hook</div>
        <ul>
          <li>Cooldown reduced from 8 to 7 seconds.</li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

### Hero Card with General Updates
```html
<div class="hero-card">
  <div class="hero-card-header">
    <h5>Hazard</h5>
  </div>
  <div class="hero-card-body">
    <div class="dev-notes">
      <p>We're lowering the ceiling and total resource that Hazard's Spike Guard oriented builds gain.</p>
    </div>
    <div class="general-updates">
      <h2>Off the Wall</h2>
      <ul>
        <li>Damage decreased from 60 to 40.</li>
      </ul>
      <h2>Woof Woof!</h2>
      <ul>
        <li>Extra [Spike Guard] Resource reduced from 30% to 15%.</li>
      </ul>
    </div>
  </div>
</div>
```

## General Updates

### Standalone General Update
```html
<div class="general-update">
  <div class="general-update-title">General</div>
  <div class="general-update-description">
    <ul>
      <li>Fixed an issue where players were unable to jump while the scoreboard was open.</li>
    </ul>
  </div>
</div>
```

### Multiple General Updates
```html
<div class="general-update">
  <div class="general-update-title">Progression</div>
  <div class="general-update-description">
    <ul>
      <li>All heroes now level up faster.</li>
    </ul>
  </div>
</div>

<div class="general-update">
  <div class="general-update-title">Mystery Heroes</div>
  <div class="general-update-description">
    <ul>
      <li>Mystery Heroes is now 6v6</li>
      <li>Map Voting is disabled</li>
    </ul>
  </div>
</div>
```

## Developer Notes

### Standalone Dev Notes
```html
<div class="dev-notes">
  <p>These changes aim to re-adjust heroes whose win rates have fallen further than intended.</p>
</div>
```

### Dev Notes within Hero Card
```html
<div class="hero-card">
  <div class="hero-card-header">
    <h5>Ramattra</h5>
  </div>
  <div class="hero-card-body">
    <div class="dev-notes">
      <p>Ramattra has started with a middling win rate in Stadium.</p>
    </div>
    <!-- Ability updates here -->
  </div>
</div>
```

## Tooltips

### Basic Tooltip
```html
<div class="tooltip">
  <div class="tooltip-header">
    <div class="tooltip-title">Information</div>
  </div>
  <div class="tooltip-body">
    <div class="tooltip-description">
      <p>This is a tooltip with important information.</p>
    </div>
  </div>
</div>
```

### Tooltip with Links
```html
<div class="tooltip">
  <div class="tooltip-header">
    <div class="tooltip-title">Patch Notes</div>
  </div>
  <div class="tooltip-body">
    <div class="tooltip-description">
      <p>Read the full patch notes for more details.</p>
    </div>
    <div class="tooltip-links">
      <a href="#" class="tooltip-link">View Full Notes</a>
    </div>
  </div>
</div>
```

## Labels and Metadata

### Patch Labels
```html
<div class="patch-labels">
  <div class="patch-date">April 28, 2026</div>
  <span>Live Patch</span>
</div>
```

## Section Description
```html
<div class="section-description">
  <p>This is a bug fix update. Replay codes have been wiped.</p>
</div>
```

## Buttons

### Top of Post Button
```html
<div class="top-of-post">
  <a href="#top">Top of post</a>
</div>
```

## Complete Example

Here's a complete example combining multiple elements:

```html
<div class="patch-entry">
  <div class="patch-labels">
    <div class="patch-date">April 28, 2026</div>
  </div>
  
  <h3>Overwatch Retail Patch Notes – April 28, 2026</h3>
  
  <div class="patch-section">
    <h4>Bug Fix Update</h4>
    <div class="section-description">
      <p>This is a bug fix update. Replay codes have been wiped.</p>
    </div>
  </div>
  
  <div class="patch-section">
    <h4>Hero Updates</h4>
    
    <div class="hero-card">
      <div class="hero-card-header">
        <h5>Roadhog</h5>
      </div>
      <div class="hero-card-body">
        <div class="ability-update">
          <div class="ability-icon"></div>
          <div class="ability-text">
            <div class="ability-name">Chain Hook</div>
            <ul>
              <li>Cooldown reduced from 8 to 7 seconds.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="patch-section">
    <h4>Bug Fixes</h4>
    <div class="general-update">
      <div class="general-update-title">General</div>
      <div class="general-update-description">
        <ul>
          <li>Fixed an issue where players were unable to jump while the scoreboard was open.</li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="dev-notes">
    <p>These changes aim to re-adjust heroes whose win rates have fallen further than intended.</p>
  </div>
  
  <div class="top-of-post">
    <a href="#top">Top of post</a>
  </div>
</div>
```

## CSS Class Reference

| Class | Purpose | Key Styles |
|-------|---------|------------|
| `.patch-entry` | Patch container | Border-bottom, padding |
| `.patch-date` | Date display | Bold, inline-block |
| `.patch-labels` | Labels container | Dimmed white, uppercase |
| `.patch-section` | Section container | 35px margin |
| `.section-description` | Section description | 16px/20px, weight 500 |
| `.hero-card` | Hero update card | 2px border, radius 2px |
| `.hero-card-header` | Card header | Dark background, padding |
| `.hero-card-body` | Card content | 5px 20px padding |
| `.ability-update` | Ability row | Flex layout |
| `.ability-icon` | Ability icon box | 40px/45px, grey background |
| `.ability-text` | Ability text container | 10px left padding |
| `.ability-name` | Ability name | Bold, white |
| `.general-updates` | General updates container | 15px margin |
| `.general-update` | General update block | 20px spacing between |
| `.general-update-title` | Update title | Bold, 16px/20px |
| `.general-update-description` | Update description | 16px/20px, weight 500 |
| `.dev-notes` | Developer notes | Orange left border, italic |
| `.tooltip` | Info tooltip | Border-radius, box-shadow |
| `.tooltip-header` | Tooltip header | White background, bold |
| `.tooltip-body` | Tooltip content | Dark background, blur |
| `.tooltip-title` | Tooltip title | Bold, uppercase |
| `.tooltip-description` | Tooltip text | 16px/20px, weight 500 |
| `.tooltip-link` | Tooltip link | Orange, underline |
| `.top-of-post` | Top button | White background, border |