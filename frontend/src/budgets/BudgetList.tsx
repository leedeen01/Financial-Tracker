import { MdDelete } from "react-icons/md";
import { Category } from "../models/category";

interface BudgetListProps {
    categories: Category[];
    deleteCategory: (category: Category) => void;
}

const BudgetList = ({ categories, deleteCategory }: BudgetListProps) => {
    return (
        <>
        <div className="row g-3 mt-5" onClick={() => {}}>
            <div className="row mx-auto col-md-12 gap-3 d-flex align-items-center justify-content-center">
                {categories.map((category) => {
                    return (
                        <div className="col-md-3 col-sm-5">
                            <div className="card h-md-100">
                                <div className="card-header pb-0 d-flex align-items-center justify-content-between" style={{backgroundColor: category.background}}>
                                    <h6 className="mb-2 mt-2">
                                        {category.name}
                                    </h6>
                                    <MdDelete onClick={() => deleteCategory(category)} className="expenselist-editdel"></MdDelete>
                                </div>

                                <div className="card-body d-flex flex-column justify-content-center">
                                    <div className="row justify-content-between">
                                        Budget: {category.budget ? '$' + category.budget.toFixed(2) : 'No budget'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        </>
    );
}

export default BudgetList;