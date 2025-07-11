## Design Language: [App Name - e.g., "SchoolSpark"]

**Motto:** Bright Learning, Simple Interactions

**Target Audience:** K-12 Students (various age groups), Teachers, School Administrators

**Core Principles:**

1.  **Engaging & Playful:** The design should captivate young users with vibrant colors, friendly visuals, and delightful micro-interactions, making learning feel like an adventure.
2.  **Intuitive & Clear:** Navigation and actions must be immediately understandable, even for the youngest users or those less familiar with technology. Clarity trumps complexity.
3.  **Accessible & Inclusive:** Design for all users, considering different abilities, learning styles, and devices. Adhere to WCAG AA standards as a baseline.
4.  **Consistent & Predictable:** Elements and patterns should behave consistently throughout the application, building user confidence and reducing cognitive load.
5.  **Supportive & Encouraging:** The interface should provide positive reinforcement and guidance, creating a supportive digital environment.

---

**I. Visual Identity**

   **A. Color Palette:**
      *   **Goal:** Vibrant, cheerful, and age-appropriate, while maintaining good contrast and avoiding overstimulation.
      *   **Primary Colors (Examples - we can choose specific hex codes later):**
          *   `Bright Blue (Playful & Trustworthy)`: For primary actions, active states, and key navigation elements.
          *   `Sunny Yellow (Optimistic & Energetic)`: For highlights, rewards, and attention-grabbing elements (use sparingly).
          *   `Leafy Green (Growth & Calm)`: For positive feedback, progress indicators, and nature-themed content.
      *   **Secondary Colors (Examples):**
          *   `Soft Orange (Friendly & Creative)`: For secondary actions or distinct sections.
          *   `Light Teal (Calm & Focused)`: For background elements or less critical information.
          *   `Playful Purple (Imaginative & Fun)`: For specific modules or achievements.
      *   **Neutral Colors:**
          *   `Warm Gray (Text & Backgrounds)`: For body text, ensuring readability.
          *   `Light Cream/Off-White (Containers)`: For content cards and section backgrounds to provide a soft, clean look.
          *   `Dark Gray (Secondary Text)`: For less prominent text or disabled states.
      *   **Usage Guidelines:**
          *   Use primary colors strategically to guide the user.
          *   Ensure a contrast ratio of at least 4.5:1 for text and interactive elements.
          *   Consider themed palettes for different subjects or age groups if applicable, but maintain overall consistency.

   **B. Typography:**
      *   **Primary Font (Example):** `Nunito` or `Poppins` (sans-serif, rounded, friendly, highly legible).
          *   Weights: Regular, SemiBold, Bold.
      *   **Secondary Font (Optional, for headings - Example):** `Fredoka One` (more playful, for large titles or section headers, use sparingly).
      *   **Hierarchy:**
          *   H1 (Page Titles): Large, bold, primary font.
          *   H2 (Section Headings): Medium, semi-bold, primary font.
          *   H3 (Sub-headings): Smaller, semi-bold or regular, primary font.
          *   Body Text: Regular weight, adequate line spacing (e.g., 1.5x font size) for readability.
          *   Button Text: Semi-bold, all caps or sentence case depending on button size.
      *   **Guidelines:**
          *   Prioritize readability across all devices and screen sizes.
          *   Use consistent font sizes and weights for similar elements.

   **C. Iconography:**
      *   **Style:** Filled icons with rounded corners and a slightly chunky, friendly appearance. Avoid overly complex or abstract icons.
      *   **Examples:**
          *   `Home`: A simple house shape.
          *   `Settings`: A friendly gear icon.
          *   `Profile`: A simple, abstract person shape.
          *   `Subjects`: Books, a lightbulb, a plant.
      *   **Guidelines:**
          *   Ensure icons are easily recognizable and their meaning is clear.
          *   Use labels with icons, especially for navigation, unless the icon is universally understood (e.g., print, close).
          *   Maintain a consistent visual weight and style across all icons.
          *   Consider using a well-known icon library (e.g., Material Symbols with a rounded style, Phosphor Icons, or a custom set).

   **D. Imagery & Illustrations:**
      *   **Style:** Bright, positive, inclusive, and diverse. Illustrations should be simple, perhaps with a flat or 2.5D style, avoiding overly realistic or distracting details.
      *   **Purpose:**
          *   To enhance engagement (e.g., characters, mascots for different sections).
          *   To explain concepts visually.
          *   For rewards and achievements.
      *   **Guidelines:**
          *   Ensure all imagery is age-appropriate and culturally sensitive.
          *   Optimize images for fast loading.

---

**II. UI Components & Patterns**

   **A. Buttons:**
      *   **Primary Buttons:** Solid background (primary color), rounded corners, clear text label, optional icon.
      *   **Secondary Buttons:** Outlined with primary color or a lighter shade of a secondary color, rounded corners.
      *   **Tertiary/Text Buttons:** Simple text link, perhaps underlined on hover.
      *   **States:** Clear visual distinction for `default`, `hover`, `pressed/active`, `disabled` states. Hover states could involve a slight scale-up or shadow.
      *   **Size:** Generous tap targets, especially for younger children.

   **B. Forms & Inputs:**
      *   **Fields:** Rounded corners, clear labels above or to the left, placeholder text as hints (not labels).
      *   **Feedback:** Real-time validation with clear, friendly error messages (e.g., "Oops! Please enter your name."). Success messages can use green checkmarks.
      *   **Dropdowns/Selects:** Easy to tap, with clear options.

   **C. Navigation:**
      *   **Primary Navigation (e.g., bottom tab bar for mobile, sidebar for desktop):** Clearly labeled icons and text. Active state highlighted.
      *   **Breadcrumbs:** For deeper sections to help users understand their location.
      *   **Back Buttons:** Prominently displayed.

   **D. Cards & Containers:**
      *   **Style:** Soft shadows, rounded corners, light cream/off-white backgrounds.
      *   **Content:** Well-structured content within cards, using typography hierarchy.

   **E. Modals & Pop-ups:**
      *   **Purpose:** For important alerts, confirmations, or focused tasks.
      *   **Design:** Overlay the main content with a semi-transparent scrim. Modal content should be clear and concise with obvious action buttons.

   **F. Feedback & Notifications:**
      *   **Toasts/Snackbars:** For non-intrusive feedback (e.g., "Assignment saved!").
      *   **Alerts:** For critical information, use distinct colors (e.g., red for errors, yellow for warnings, green for success).
      *   **Progress Indicators:** Use fun, visual progress bars or loaders.

---

**III. Interaction & Motion**

   *   **Goal:** Provide delightful feedback and guide attention without being distracting.
   *   **Transitions:** Smooth page transitions (e.g., subtle slide or fade).
   *   **Micro-interactions:**
       *   Button clicks can have a slight bounce or color change.
       *   Loading states can feature a simple, playful animation.
       *   Successful actions can trigger a small celebratory animation (e.g., confetti for completing a task).
   *   **Avoid:** Overly complex or lengthy animations that slow down the user.

---

**IV. Accessibility (Recap)**

   *   **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text.
   *   **Keyboard Navigation:** All interactive elements must be focusable and operable via keyboard.
   *   **Screen Reader Support:** Use semantic HTML, ARIA attributes where necessary, and provide alt text for images.
   *   **Touchable Targets:** Ensure tap targets are at least 44x44 pixels.
   *   **Readable Fonts & Sizes:** Use clear fonts and allow users to adjust font size if possible.

--- 