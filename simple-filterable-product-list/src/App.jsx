import { useState } from "react";

function ProductRow({ product }) {
  let name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const filteredProducts = [];
  products.forEach((product) => {
    if (inStockOnly && !product.stocked) {
      return;
    }
    let productName = `${product.category}#${product.name}`;
    if (productName.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    filteredProducts.push(product);
  });

  const productsInCategory = {};
  for (let product of filteredProducts) {
    if (!(product.category in productsInCategory)) {
      productsInCategory[product.category] = [];
    }
    productsInCategory[product.category].push(product);
  }

  let rows = [];
  let key = 0;
  for (let category in productsInCategory) {
    rows.push(<ProductCategoryRow key={key++} category={category} />);
    for (let product of productsInCategory[category]) {
      rows.push(<ProductRow key={key++} product={product} />);
    }
  }

  return (
    <table className="w-[400px] mt-5 border border-collapse ">
      <thead>
        <tr className="border border-black">
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {

  return (
    <div>
      <input
        className="block px-1 py-2 mb-2 border border-black rounded outline-none focus:ring-2"
        type="search"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => (onFilterTextChange(e.target.value))}
      />
      <label htmlFor="show-stock">
        <input
          type="checkbox"
          id="show-stock"
          value={filterText}
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
          className="mr-1"
        />
        Only show products in stock
      </label>
    </div>
  );
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <>
      <SearchBar
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
      <ProductTable
        filterText={filterText}
        inStockOnly={inStockOnly}
        products={products}
      />
    </>
  );
}

function App() {
  return (
    <div className="py-2 px-4 border border-black rounded w-[500px] mx-auto my-5 flex flex-col items-center ">
      <FilterableProductTable products={PRODUCTS} />
    </div>
  );
}

export default App;

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];
