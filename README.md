# Christmas Party Santa Picker

A fun web application for hosting a Christmas party where guests spin a wheel to determine who will be "Santa" and get free drinks at the bar!

## Features

- 🎡 Interactive spinning wheel to select this year's Santa
- 👤 Admin panel to manage party guests
- 🎯 Rigging controls to determine who can be selected
- 🎉 Festive UI with Christmas theme
- 💾 Local storage for data persistence
- 📱 Responsive design for all devices

## How It Works

1. **Add Guests**: Use the admin panel to add all party guests
2. **Set Eligibility**: Toggle which guests are eligible to be Santa
3. **Spin the Wheel**: Click the spin button to randomly select a Santa
4. **Celebrate**: The selected Santa gets free drinks at the bar!

## Pages

- **Home** (`/`): Welcome page with instructions
- **Wheel** (`/wheel`): The main wheel spinning interface
- **Admin** (`/admin`): Manage guests and rigging settings

## Rigging Functionality

The app includes "rigging" functionality that allows you to control who can be selected as Santa:

1. In the admin panel, toggle the eligibility switch for each guest
2. Only guests marked as "Eligible" can be selected by the wheel
3. This creates the appearance of a fair selection while allowing you to control the outcome

## Technical Details

- Built with Next.js 15 App Router
- Uses Tailwind CSS and Shadcn UI components
- Client-side data storage with localStorage
- Framer Motion for animations
- Fully responsive design

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the development server:
   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This app can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or Cloudflare Pages.

## Customization

- **Styling**: Modify the theme in `app/globals.css`
- **Components**: Add or modify components in the `components` directory
- **Pages**: Edit page content in the `app` directory

## License

This project is MIT licensed.

