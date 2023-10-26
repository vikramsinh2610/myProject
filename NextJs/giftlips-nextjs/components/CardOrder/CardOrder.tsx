import React from "react";
import moment from "moment";

const CardOrder = ({ cardData }: any) => {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Address</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {cardData?.map((item: any, i: any) => {
            return (
              <tr key={i}>
                <td>{item?.addressLine},
                      <br/>
                      {item?.city},&nbsp;
                      {item?.country}
                </td>
                <td>{moment(item?.createdAt).format('h:mm a, MMMM DD YYYY ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {cardData?.length === 0 && (
        <p className="d-flex align-item-center justify-content-center">
          No data Found{" "}
        </p>
      )}
    </>
  );
};

export default CardOrder;
