
import React from "react";
import { useParams } from "react-router-dom";

export default function EditService() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
    </div>
  );
}
