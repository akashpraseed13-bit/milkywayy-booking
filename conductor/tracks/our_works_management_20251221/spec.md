# Specification: Our Works Management & Portfolio Page

## 1. Overview
This track introduces a dynamic "Our Works" management system. It enables Administrators to manage a portfolio of projects (Images, 360 Views, YouTube Videos, Instagram Reels) via the Admin Panel. It also includes updating the Landing Page to showcase the top 3 highlights and creating a dedicated `/portfolio` page for users to explore the full collection filtered by media type.

## 2. User Roles
*   **Super Administrators:** Full access to create, edit, delete, reorder, and toggle visibility of "Our Work" entries.
*   **Customers:** Read-only access to view the "Our Works" on the Landing Page and the new Portfolio page.

## 3. Functional Requirements

### 3.1 Data Model: "Our Work"
A new entity `OurWork` (or `PortfolioItem`) will be created with the following fields:
*   **ID:** Unique Identifier.
*   **Title:** Text (String).
*   **Subtitle:** Text (String).
*   **Type:** Enum/Selection. Options:
    *   `Image`
    *   `360_View` (Panoee)
    *   `Video` (YouTube)
    *   `Short_Video` (Instagram Reel)
*   **Media Content:**
    *   For `Image`: URL (stored in S3).
    *   For `360_View`: Embed URL/Code (Text).
    *   For `Video`: YouTube Video URL (Text).
    *   For `Short_Video`: Instagram Reel URL (Text).
*   **Order:** Integer (for custom sorting).
*   **Is_Visible:** Boolean (Published/Draft status).
*   **Created_At / Updated_At:** Timestamps.

### 3.2 Admin Panel Features
*   **List View:**
    *   Display all entries in a list/table.
    *   **Reordering:** Drag-and-drop or position input to change the display order.
    *   **Toggle Visibility:** Quick switch to Publish/Unpublish.
    *   **Delete:** Option to remove an entry.
*   **Create/Edit Form:**
    *   Input fields for Title and Subtitle.
    *   **Type Selection:** Dropdown/Radio to select media type.
    *   **Dynamic Media Input:**
        *   If `Image`: File upload component (uploads to AWS S3).
        *   If `360_View`, `Video`, or `Short_Video`: Text input for the respective URL.
    *   Validation to ensure required fields are present.

### 3.3 Public User Interface
*   **Landing Page Update:**
    *   Modify the existing "Our Work" section.
    *   Fetch and display only the **Top 3** visible entries based on the custom sort order.
    *   "See All" button redirecting to `/portfolio`.
*   **New `/portfolio` Page:**
    *   **Tabs/Filter:** Navigation tabs to filter content by **Type** (All, Images, 360 Views, Videos, Shorts).
    *   **Grid Layout:** Display the full list of visible entries.
    *   **Media Rendering:**
        *   `Image`: Standard `<img>` tag (optimized).
        *   `360_View`: Embedded Panoee iframe.
        *   `Video`: Embedded YouTube player.
        *   `Short_Video`: Embedded Instagram player.

## 4. Technical Considerations
*   **Database:** Create new Sequelize migration and model for `OurWork`.
*   **API:**
    *   GET `/api/our-works` (Public): Supports filtering/limit.
    *   POST/PUT/DELETE `/api/admin/our-works` (Protected): For management.
    *   PATCH `/api/admin/our-works/reorder` (Protected): To update order.
*   **Security:** Ensure Admin API routes are protected by authentication and authorization middleware.
*   **Performance:** Optimize image loading (Next.js Image) and lazy load iframes for videos/360 views to improve page speed.
