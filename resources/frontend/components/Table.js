import React, { useState } from "react";
import styles from "./Table.module";
import Icon from "./Icon";
import Button from "./Button";
import Tag from "./Tag";

export default function Table({
    checkbox,
    data,
    action,
    onView,
    openModal,
    visibleColumns,
    visibleActions,
}) {
    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const isDataValid = Array.isArray(data?.data);
    const totalPages = isDataValid
        ? Math.ceil(data.data.length / itemsPerPage)
        : 0;

    const currentItems = isDataValid
        ? data.data.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage,
          )
        : [];

    const formatHeader = (header) => {
        const words = header.split(/(?<=[a-z])(?=[A-Z])|_/);
        const formattedWords = words.slice(1).join(" ");
        return formattedWords.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").trim();
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const renderTableHeader = () => (
        <thead>
            <tr>
                {checkbox && (
                    <th>
                        <input type="checkbox" />
                    </th>
                )}
                {isDataValid &&
                    visibleColumns.map((header, index) => (
                        <th key={index}>{formatHeader(header)}</th>
                    ))}
                {action && <th>Action</th>}
            </tr>
        </thead>
    );

    const renderTableRow = (item, index) => (
        <React.Fragment key={index}>
            <tr>
                {checkbox && (
                    <td>
                        <input type="checkbox" />
                    </td>
                )}
                {visibleColumns.map((header, index) => (
                    <td key={index}>
                        {formatHeader(header).toLowerCase() === "image" ||
                        formatHeader(header).toLowerCase() ===
                            "category image" ? (
                            <div className={styles.tableImageContainer}>
                                <img
                                    className={styles.image}
                                    src={
                                        item.productImage
                                            ? `${process.env.R2_PUBLIC_URL}/${item.productImage}`
                                            : `${process.env.R2_PUBLIC_URL}/${item.productCategoryImage}`
                                    }
                                    alt={item.product || "Product Image"}
                                />
                                <div
                                    className={styles.tableViewImage}
                                    onClick={() =>
                                        openModal(
                                            "image",
                                            item.productImage
                                                ? item.productImage
                                                : item.productCategoryImage,
                                            null,
                                        )
                                    }
                                >
                                    <Icon icon="view" size="20" />
                                </div>
                            </div>
                        ) : formatHeader(header).toLowerCase() === "price" ||
                          formatHeader(header).toLowerCase() === "total" ? (
                            `₱ ${item[header]}`
                        ) : ["status", "branch", "position"].some((key) =>
                              formatHeader(header).toLowerCase().includes(key),
                          ) ? (
                            <Tag
                                text={item[header]}
                                icon={formatHeader(header)
                                    .toLowerCase()
                                    .includes("status")}
                            />
                        ) : (
                            item[header]
                        )}
                    </td>
                ))}
                {action && renderActionButtons(item)}
            </tr>
            <tr>
                <td colSpan={calculateColSpan()} style={{ padding: "0px" }}>
                    <hr />
                </td>
            </tr>
        </React.Fragment>
    );

    const renderActionButtons = (item) => {
        const isProduct = "productID" in item;

        return (
            <td>
                <div className={styles.tableAction}>
                    {visibleActions.includes("view") && (
                        <Button
                            icon="view"
                            size="24"
                            className={styles.tableButton}
                            onClick={() => onView(item)}
                        />
                    )}
                    {visibleActions.includes("delete") && (
                        <Button
                            icon="delete"
                            size="24"
                            className={styles.tableButton}
                            onClick={() =>
                                openModal(
                                    isProduct
                                        ? "delete"
                                        : "deleteProductCategory",
                                    isProduct
                                        ? item.productID
                                        : item.productCategoryID,
                                    null,
                                )
                            }
                        />
                    )}
                    {visibleActions.includes("edit") && (
                        <Button
                            icon="edit"
                            size="24"
                            className={styles.tableButton}
                            onClick={() =>
                                openModal(
                                    isProduct ? "edit" : "editProductCategory",
                                    null,
                                    item,
                                )
                            }
                        />
                    )}
                </div>
            </td>
        );
    };

    const calculateColSpan = () =>
        (visibleColumns.length || 0) + (checkbox ? 1 : 0) + (action ? 1 : 0);

    const renderNoData = () => (
        <tr>
            <td colSpan={calculateColSpan()}>
                <div className={styles.noData}>No entries available.</div>
            </td>
        </tr>
    );

    const renderPagination = () => (
        <div className={styles.tableBottom}>
            <div className={styles.page}>
                Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, data.data.length)} of{" "}
                {data.data.length} entries
            </div>
            <div className={styles.pagination}>
                <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <Icon icon="chevLeft" size="20" />
                </button>
                <div className={styles.paginationPage}>{currentPage}</div>
                <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Icon icon="chevRight" size="20" />
                </button>
            </div>
        </div>
    );

    return (
        <>
            <table className={styles.table}>
                {renderTableHeader()}
                <tbody>
                    {currentItems.length > 0
                        ? currentItems.map(renderTableRow)
                        : renderNoData()}
                </tbody>
            </table>
            {isDataValid && currentItems.length > 0 && renderPagination()}
        </>
    );
}
