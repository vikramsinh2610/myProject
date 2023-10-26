import React, { useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import http from "@/services/http.service";
import { devLog } from "@/helpers/logger";
import Link from "next/link";

export default function POC() {
  const [cards, setCards] = useState<any[]>([]);

  const getCards = useCallback(async () => {
    const response = await http.get("/cards");
    const data = await response.data;
    setCards(data.docs);
    devLog(data.docs);
  }, []);

  useEffect(() => {
    void getCards();
  }, [getCards]);

  return (
    <Layout>
      {cards.length > 0 ? (
        <ul>
          {cards.map((card) => (
            <li key={card._id} className="flex gap-4">
              <span>{card._id}</span>
              <Link href={`/poc/cards/${card._id}`}>index</Link>
              <Link href={`/poc/cards/${card._id}/svgeditor`}>svgeditor</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>No cards found.</div>
      )}
    </Layout>
  );
}
