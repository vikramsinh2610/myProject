import React, { useCallback, useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";
import http from "@/services/http.service";
import Layout from "@/components/Layout";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TemplatesSorter() {
  const [templates, setTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const getTemplates = useCallback(async () => {
    const res = await http.get(`/public/templates/all`);
    const data = await res.data.data;
    setTemplates(data);
  }, []);

  useEffect(() => {
    void getTemplates();
  }, [getTemplates]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setTemplates((array) => arrayMove(array, oldIndex, newIndex));
  };

  const handleUpdatePositions = async () => {
    setIsSaving(true);
    const res = await http.put("/templates/setPositions", { templates });
    const data = await res.data;

    if (data.success === true) {
      toast.success(data.message);
    }

    setIsSaving(false);
  };

  return (
    <Layout>
      <ToastContainer />

      <SortableList
        onSortEnd={onSortEnd}
        className="list grid select-none grid-cols-4 gap-4"
        draggedItemClassName="dragged"
      >
        {templates.map((template) => (
          <SortableItem key={template._id}>
            <Image
              className="item pointer-events-none flex cursor-grab select-none items-center justify-center"
              src={template.coverUrl}
              alt={template.title}
              title={template.title}
              width={500}
              height={500}
              priority
            />
          </SortableItem>
        ))}
      </SortableList>

      <button
        className={`btn-primary btn sticky bottom-10 ${
          isSaving && "loading"
        }`}
        onClick={handleUpdatePositions}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </Layout>
  );
}
