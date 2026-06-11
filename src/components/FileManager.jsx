import React, { useEffect, useRef, useState } from "react";

const FileManager = () => {
    const [db, setDb] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [sortBy, setSortBy] = useState("time");
    const [previewFile, setPreviewFile] = useState(null);

    const touchTimer = useRef(null);

    // -----------------------------
    // DATABASE SETUP
    // -----------------------------
    useEffect(() => {
        const request = indexedDB.open("MyFilesDB", 1);

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            if (!database.objectStoreNames.contains("files")) {
                database.createObjectStore("files", {
                    keyPath: "name",
                });
            }
        };

        request.onsuccess = (event) => {
            const database = event.target.result;
            setDb(database);
        };
    }, []);

    // -----------------------------
    // LOAD FILES WHEN DB READY
    // -----------------------------
    useEffect(() => {
        if (db) {
            loadFiles();
        }
    }, [db]);

    // -----------------------------
    // LOAD FILES
    // -----------------------------
    const loadFiles = () => {
        if (!db) return;

        const transaction = db.transaction("files", "readonly");
        const store = transaction.objectStore("files");

        const request = store.getAll();

        request.onsuccess = () => {
            const loadedFiles = request.result.map((item) => ({
                ...item,
                url: URL.createObjectURL(item.file),
            }));

            setFiles(loadedFiles);
        };
    };

    // -----------------------------
    // UPLOAD FILES
    // -----------------------------
    const handleFiles = (e) => {
        if (!db) return;

        const uploadedFiles = Array.from(e.target.files);

        const transaction = db.transaction("files", "readwrite");
        const store = transaction.objectStore("files");

        uploadedFiles.forEach((file) => {
            store.put({
                name: file.name,
                type: file.type,
                size: file.size,
                createdAt: Date.now(),
                file,
            });
        });

        transaction.oncomplete = () => {
            loadFiles();
        };
    };

    // -----------------------------
    // DELETE FILES
    // -----------------------------
    const deleteSelected = () => {
        if (!db) return;

        const transaction = db.transaction("files", "readwrite");
        const store = transaction.objectStore("files");

        selectedFiles.forEach((name) => {
            store.delete(name);
        });

        transaction.oncomplete = () => {
            setSelectedFiles([]);
            setSelectionMode(false);
            loadFiles();
        };
    };

    // -----------------------------
    // SELECTION
    // -----------------------------
    const toggleSelection = (name) => {
        setSelectedFiles((prev) =>
            prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name]
        );
    };

    // -----------------------------
    // SORTING
    // -----------------------------
    const sortedFiles = [...files].sort((a, b) => {
        if (sortBy === "time") {
            return b.createdAt - a.createdAt;
        }

        if (sortBy === "size") {
            return b.size - a.size;
        }

        if (sortBy === "type") {
            return a.type.localeCompare(b.type);
        }

        return 0;
    });

    const downloadFile = (file) => {
        const a = document.createElement("a");

        a.href = file.url;
        a.download = file.name;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadSelected = () => {
        files.forEach((file) => {
            if (selectedFiles.includes(file.name)) {
                downloadFile(file);
            }
        });
    };
    const mouseTimer = useRef(null);
    const [selectionMode, setSelectionMode] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-white shadow-md p-4 flex flex-wrap gap-4 justify-between items-center">
                <h1 className="text-2xl font-bold">
                    📂 File Manager
                </h1>

                    <div className="flex gap-1 flex-wrap">
                        <button
                            onClick={() => {
                                setSelectionMode(!selectionMode);

                                if (selectionMode) {
                                    setSelectedFiles([]);
                                }
                            }}
                            className="bg-purple-600 text-white text-sm px-2 py-1 rounded-lg"
                        >
                            {selectionMode ? "Cancel" : "Select"}
                        </button>

                        <button
                            onClick={() => {
                                setSelectedFiles(files.map((file) => file.name));
                            }}
                            className="bg-green-600 text-white px-2 text-sm py-1 rounded-lg"
                        >
                            Select All
                        </button>

                        <button
                            onClick={() => {
                                setSelectedFiles([]);
                            }}
                            className="bg-gray-600 text-white px-2 text-sm py-1 rounded-lg"
                        >
                            Clear
                        </button>
                    </div>
                <div className="flex gap-1 items-center">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="time">Sort by Time</option>
                        <option value="size">Sort by Size</option>
                        <option value="type">Sort by Type</option>
                    </select>

                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                        Upload
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf"
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* GRID */}
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sortedFiles.map((item) => (
                    <div
                        key={item.name}
                        className={`bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer relative
${selectedFiles.includes(item.name)
                                ? "ring-4 ring-blue-500"
                                : ""
                            }`}
                        onClick={() => {
                            if (selectionMode) {
                                toggleSelection(item.name);
                                return;
                            }

                            setPreviewFile(item);
                        }}
                    >
                        <div className="relative">
                            {selectionMode && (
                                <div className="absolute top-2 left-2 z-0">
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.includes(item.name)}
                                        readOnly
                                    />
                                </div>
                            )}

                            {/* thumbnail */}
                        </div>
                        {/* THUMBNAIL */}
                        <div className="h-40 bg-slate-200 flex justify-center items-center overflow-hidden">
                            {item.type.startsWith("image/") && (
                                <img
                                    src={item.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {item.type.startsWith("video/") && (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {item.type === "application/pdf" && (
                                <iframe
                                    src={item.url}
                                    title={item.name}
                                    className="w-full h-full"
                                />
                            )}
                        </div>

                        {/* INFO */}
                        <div className="p-3">
                            <p className="truncate font-medium">
                                {item.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {(item.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* DELETE BUTTON */}
            {selectionMode && selectedFiles.length > 0 && (
                <>
                    <button
                        onClick={deleteSelected}

                        className="fixed bottom-5 right-5 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg"
                    >
                        Delete ({selectedFiles.length})
                    </button>
                    <button
                        onClick={downloadSelected}
                        className="fixed bottom-20 right-5 bg-green-500 text-white px-6 py-3 rounded-full"
                    >
                        Download Selected
                    </button>
                </>
            )}

            {/* PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 flex-col bg-black/80 z-50 flex justify-center items-center p-4"
                    onMouseDown={() => {
                        mouseTimer.current = setTimeout(() => {
                            toggleSelection(previewFile.name);
                        }, 600);
                    }}
                    onMouseUp={() => clearTimeout(mouseTimer.current)}
                    onMouseLeave={() => clearTimeout(mouseTimer.current)}
                    onTouchStart={() => {
                        touchTimer.current = setTimeout(() => {
                            toggleSelection(previewFile.name);
                        }, 600);
                    }}
                    onTouchEnd={() => clearTimeout(touchTimer.current)}
                //   onClick={(e) => {
                //   if (e.ctrlKey) {
                //     toggleSelection(previewFile.name);
                //     return;
                //   }

                //   setPreviewFile(previewFile);
                // }}
                >
                    <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto relative">
                        <button
                            onClick={() => setPreviewFile(null)}
                            className="absolute right-4 top-4 bg-red-500 text-white px-3 py-1 rounded"
                        >
                            ✕
                        </button>

                        <div className="p-4">
                            <h2 className="font-bold text-xl mb-4">
                                {previewFile.name}
                            </h2>

                            {previewFile.type.startsWith("image/") && (
                                <img
                                    src={previewFile.url}
                                    alt=""
                                    className="w-full rounded-lg"
                                />
                            )}

                            {previewFile.type.startsWith("video/") && (
                                <video
                                    src={previewFile.url}
                                    controls
                                    className="w-full rounded-lg"
                                />
                            )}

                            {previewFile.type === "application/pdf" && (
                                <iframe
                                    src={previewFile.url}
                                    title={previewFile.name}
                                    className="w-full h-[80vh]"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => downloadFile(previewFile)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Download
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileManager;