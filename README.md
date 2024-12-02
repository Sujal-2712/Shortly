<!DOCTYPE html>
<html>
<body>
    <h1 align="center">🌐 URL Shortener</h1>
    <p align="center">
        <b>A full-featured URL shortener built using the MERN stack!</b><br>
        Includes custom URLs, QR code generation, and advanced analytics for tracking clicks by country, device, and total clicks.
    </p>
    <h2>🚀 Features</h2>
    <ul>
        <li>Shorten URLs with ease.</li>
        <li>Create custom URLs for branding.</li>
        <li>Generate QR codes for each short URL.</li>
        <li>Track analytics:
            <ul>
                <li>Total clicks.</li>
                <li>Clicks by country.</li>
                <li>Clicks by device (mobile/desktop).</li>
            </ul>
        </li>
        <li>Fully responsive and user-friendly interface.</li>
    </ul>
    <h2>📂 Folder Structure</h2>
    <pre>
    .
    ├── client                # Frontend (React.js)
    │   ├── public            # Static assets
    │   └── src               # React components and pages
    ├── server                # Backend (Node.js + Express.js)
    │   ├── config            # Database configuration
    │   ├── models            # Mongoose models
    │   └── routes            # API routes
    ├── .env.example          # Environment variable example
    ├── package.json          # Dependency management
    └── README.md             # Project documentation
    </pre>
    <h2>🛠️ Installation</h2>
    <p>Follow these steps to run the project locally:</p>
    <ol>
        <li>Clone this repository:</li>
        <pre><code>git clone https://github.com/Sujal-2712/Shortly.git</code></pre>
        <li>Navigate to the project directory:</li>
        <pre><code>cd Shortly</code></pre>
        <li>Install dependencies for both client and server:</li>
        <pre><code>
        cd client
        npm install
        cd ../server
        npm install
        </code></pre>
        <li>Set up environment variables:
            <ul>
                <li>Copy the <code>.env.example</code> file to <code>.env</code> in the server directory.</li>
                <li>Fill in the required details (MongoDB URI, API keys, etc.).</li>
            </ul>
        </li>
        <li>Start the development servers:</li>
        <pre><code>
        # Start the client
        cd client
        npm start
        # Start the server
        cd ../server
        npm run dev
        </code></pre>
    </ol>
    <h2>📸 Screenshots</h2>
    <p>Add some screenshots or GIFs of your application in action.</p>
    <h2>👨‍💻 Technologies Used</h2>
    <ul>
        <li><b>Frontend:</b> React.js, Tailwind CSS,Shadcn UI</li>
        <li><b>Backend:</b> Node.js, Express.js</li>
        <li><b>Database:</b> MongoDB</li>
        <li><b>Libraries:</b> QR Code Generator, GeoIP Lookup</li>
    </ul>
    <h2>📊 Analytics</h2>
    <p>Analytics dashboard provides insights such as:</p>
    <ul>
        <li>Total number of clicks.</li>
        <li>Geographical distribution of clicks by country.</li>
        <li>Device types used for clicking (mobile or desktop).</li>
    </ul>
    <h2>📜 License</h2>
    <p>This project is licensed under the <a href="https://github.com/your-username/your-repo-name/blob/main/LICENSE">MIT License</a>.</p>
    <h2>🙏 Acknowledgements</h2>
    <ul>
        <li>QR Code generation powered by <a href="https://github.com/soldair/node-qrcode">node-qrcode</a>.</li>
        <li>GeoIP services by <a href="https://ipgeolocation.io/">IPGeolocation</a>.</li>
    </ul>
    <h2>📧 Contact</h2>
    <p>For inquiries or support, reach out at <a href="mailto:your-email@example.com">sujalkareliya27@gmail.com</a>.</p>
</body>
</html>
