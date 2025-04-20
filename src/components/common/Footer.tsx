export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto text-center">
          <p className="mb-4">©<span>&copy; {new Date().getFullYear()}</span>{" "}CythBlog. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="https://x.com/MythChemical" className="hover:text-gray-400">Twitter</a>
            <a href="https://github.com/certainlyMohneeesh" className="hover:text-gray-400">GitHub</a>
            <a href="https://www.linkedin.com/in/mohneesh-naidu-780476251" className="hover:text-gray-400">LinkedIn</a>
          </div>
        </div>
      </footer>
    );
  }
  