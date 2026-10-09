"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SubjectCard {
  id: string;
  title: string;
  level: string;
  tasksCount: string;
  description: string;
  progress: number;
}

const subjectsData: SubjectCard[] = [
  {
    id: "literature",
    title: "Уран зохиол",
    level: "Эхлэн суралцагч",
    tasksCount: "3/5 даалгавар",
    description: "Эх сурвалжид дүгнэлт хийх, зохиолын утга санаа болон логик холбоог шинжлэх даалгаврууд.",
    progress: 60,
  },
  {
    id: "chemistry",
    title: "Хими",
    level: "Дунд шат",
    tasksCount: "1/4 даалгавар",
    description: "Бодисын шинж чанар, урвалын тэгшитгэл болон туршилтын үр дүнг шинжлэх даалгаврууд.",
    progress: 25,
  },
  {
    id: "biology",
    title: "Биологи",
    level: "Дунд шат",
    tasksCount: "2/6 даалгавар",
    description: "Амьд организмын бүтэц, экосистем ба байгалийн үзэгдлийн туршилтын даалгаврууд.",
    progress: 33,
  },
];

export default function SubjectPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Бүх түвшин");

  const filteredSubjects = subjectsData.filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "Бүх түвшин" || sub.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Толгой хэсэг */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "800", color: "#111827", margin: "0 0 8px 0" }}>
              PISA LMS - Сурлагын дашборд
            </h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Суралцах хичээл болон даалгавраа сонгоно уу.
            </p>
          </div>
          <Link
            href="/teacher"
            style={{
              backgroundColor: "#1e293b",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}
          >
            👨‍🏫 Багшийн цэс
          </Link>
        </header>

        {/* Хайлт ба Шүүлтүүр */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="Хичээлийн нэрээр хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "1rem"
            }}
          />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              outline: "none",
              fontSize: "1rem"
            }}
          >
            <option value="Бүх түвшин">Бүх түвшин</option>
            <option value="Эхлэн суралцагч">Эхлэн суралцагч</option>
            <option value="Дунд шат">Дунд шат</option>
            <option value="Ахисан шат">Ахисан шат</option>
          </select>
        </div>

        {/* Хичээлүүд */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.8rem", backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                    {sub.level}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{sub.tasksCount}</span>
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
                  {sub.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: "1.5", marginBottom: "20px" }}>
                  {sub.description}
                </p>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" }}>
                  <span style={{ color: "#6b7280" }}>Гүйцэтгэл</span>
                  <span style={{ color: "#2563eb" }}>{sub.progress}%</span>
                </div>
                <div style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
                  <div style={{ width: `${sub.progress}%`, backgroundColor: "#2563eb", height: "100%" }} />
                </div>

                {/* alert()-гүй, шууд /task рүү шилжих Link */}
                <Link
                  href="/task"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    padding: "10px 0",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "600",
                    boxSizing: "border-box"
                  }}
                >
                  Үргэлжлүүлэх
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}