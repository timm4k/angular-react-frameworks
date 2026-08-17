import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectSortedProducts,
  selectUniqueCategories,
  selectProductFilterCategory,
  selectProductOnlyInStock,
  selectProductSortField,
  selectProductSortOrder,
  setCategoryFilter,
  toggleInStockFilter,
  setSortField,
  toggleSortOrder,
  randomizeStock,
  setInStock,
  type SortField,
} from "./productsSlice";
import {
  selectCartSummary,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  selectAllCartItems,
  selectCartProductIds,
} from "@/features/cart/cartSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSortedProducts);
  const categories = useAppSelector(selectUniqueCategories);
  const currentCategory = useAppSelector(selectProductFilterCategory);
  const onlyInStock = useAppSelector(selectProductOnlyInStock);
  const sortField = useAppSelector(selectProductSortField);
  const sortOrder = useAppSelector(selectProductSortOrder);
  const cartItems = useAppSelector(selectAllCartItems);
  const cartSummary = useAppSelector(selectCartSummary);
  const cartProductIds = useAppSelector(selectCartProductIds);
  const [tableParent] = useAutoAnimate();
  const [cartParent] = useAutoAnimate();
  const randomized = useRef(false);

  useEffect(() => {
    if (randomized.current) return;
    randomized.current = true;
    dispatch(randomizeStock(cartProductIds));
  }, [dispatch]);

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  }) => {
    if (!product.inStock)
      dispatch(setInStock({ id: product.id, inStock: true }));
    dispatch(addToCart(product.id, product.name, product.price));
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-primary" />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={currentCategory}
              onValueChange={(v) => dispatch(setCategoryFilter(v))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                id="in-stock"
                checked={onlyInStock}
                onCheckedChange={() => dispatch(toggleInStockFilter())}
              />
              <Label htmlFor="in-stock" className="cursor-pointer">
                In Stock Only
              </Label>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort: {sortField} {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => dispatch(setSortField("name"))}
                >
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => dispatch(setSortField("price"))}
                >
                  Price
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(toggleSortOrder())}>
                  Toggle Order ({sortOrder === "asc" ? "desc" : "asc"})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={tableParent}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => dispatch(setSortField("name"))}
                    >
                      Name {sortIcon("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-right"
                      onClick={() => dispatch(setSortField("price"))}
                    >
                      Price {sortIcon("price")}
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={product.inStock ? "default" : "destructive"}
                        >
                          {product.inStock ? "In Stock" : "Out"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No products match the current filters.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cart</CardTitle>
            <Badge>{cartSummary.totalItems} items</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-primary">
                ${cartSummary.totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>

            <Separator />

            <div ref={cartParent} className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => dispatch(decrementQuantity(item.id))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => dispatch(incrementQuantity(item.id))}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {cartItems.length === 0 && (
              <p className="text-center text-muted-foreground py-4 text-sm">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Cart is empty
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
