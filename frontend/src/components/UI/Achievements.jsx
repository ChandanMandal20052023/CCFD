import React from "react";

const achievements = [
  {
    name: "JAVA",
    img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg",
  },
  {
    name: "PYTHON",
    img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  },
  {
    name: "JS",
    img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  },
  {
    name: "Figma",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    name: "Add",
    img: "https://img.icons8.com/ios-filled/50/000000/plus-math.png",
  },
];

export default function Achievements() {
  return (
    <div className="w-[100vw] md:w-auto md:max-w-auto bg-[#f3f3f3] rounded-[10px] px-4 py-4">
      <h2 className="text-[18px] font-semibold mb-6 text-center">Achievements</h2>

      <div className="grid grid-cols-3 gap-6 place-items-center">
        {achievements.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center shadow">
              <img
                src={item.img}
                alt={item.name}
                className="w-10 h-10 object-contain"
              />
            </div>
            <p className="text-sm font-medium text-gray-700 text-center">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
