export const getExtension = (path: any) => {
  let basename = path?.split(/[\\/]/).pop(),
    pos = basename?.lastIndexOf(".");

  if (basename === "" || pos < 1) return "";

  return basename?.slice(pos + 1);
};

export const emailAddressPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address.",
};

export const draggableHorizontal = (el: string) => {
  const slider: any = document.querySelector(el);
  let isDown: boolean = false,
    startX: any,
    scrollLeft: any;

  slider.addEventListener("mousedown", (e: any) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mousemove", (e: any) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
};
