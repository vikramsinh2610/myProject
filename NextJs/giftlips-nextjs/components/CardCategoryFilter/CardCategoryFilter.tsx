import { Button, Dropdown, Form } from "react-bootstrap";
import { devLog } from "../../helpers/logger";
import { categoriesOptions as categories } from "./utils";
import React from "react";
import { useRef } from "react";
import Right from "../../public/images/angle-right-solid.svg";
import Left from "../../public/images/angle-left-solid.svg";
import Image from "next/image";

const CardCategoryFilter = ({ currentFilter, onClick }: any) => {
  const category = categories.find((item) => item.id === currentFilter);
  devLog(currentFilter);
  const scrollElement: any = useRef(null);

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 790;
  };
  const scrollRight = () => {
    scrollElement.current.scrollLeft += 790;
  };
  return (
    <div className="categories-buttons-container py-2 filter-buttons m-w-full">
      <div className="customChipSlider">
        <Button variant="primary" id="slideBack" className="d-none d-lg-block sliderPrevBtn"
          onClick={scrollLeft}
        ><Image src={Left} alt={""} /></Button>

      <div
        className="container text-center px-0 text-nowrap draggable-horizontal-scroll d-none d-lg-block"
        style={{ overflow: "auto hidden" }}
          ref={scrollElement}
      >
        {categories.map((o: any, index: number) => {
          return (
            <div key={index} className="col d-inline-block px-2">
              <button
                type="button"
                className={`d-flex align-items-center gap-1 btn btn-gl-gray-3 rounded-pill text-gl-secondary font-primary fw-normal fs-6 lh-px-24 px-px-20 px-px-sm-40 px-px-lg-17 py-px-15 ${
                  currentFilter === o.id || (!currentFilter && o.id === "all")
                    ? "btn-outline-gl-secondary"
                    : ""
                }`}
                onClick={() => onClick(o)}
              >
                <div>{o?.icon}</div>
                <div>{o?.title}</div>
              </button>
            </div>
          );
        })}
      </div>

        <Button variant="primary" id="slide" onClick={scrollRight} className="sliderNextBtn d-none d-lg-block"> <Image src={Right} alt={""} /></Button>
      </div>
      <Dropdown className="mb-dropdown d-block d-lg-none">
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className="btn rounded-pill text-gl-secondary font-primary"
          style={{
            background: "#F8F8F8",
            borderColor: "#000",
            gap: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: "8px" }}>
            {category?.icon}
            {currentFilter ? category?.title : "All Events"}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: "100%" }}>
          {categories.map((o: any, index: number) => {
            return (
              <Dropdown.Item onClick={() => onClick(o)} key={o.id}>
                {o?.icon} {o?.title}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default CardCategoryFilter;