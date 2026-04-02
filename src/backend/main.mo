import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Bool "mo:core/Bool";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserId = Principal;
  public type ProductId = Nat;
  public type OrderId = Nat;
  public type Category = Text;

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageUrl : ?Text;
  };

  public type Order = {
    id : OrderId;
    userId : UserId;
    items : [(ProductId, Nat)];
    totalPrice : Nat;
  };

  var nextProductId = 1;
  var nextOrderId = 1;
  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let productsByCategory = Map.empty<Category, List.List<Product>>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    let productId = nextProductId;
    nextProductId += 1;

    let newProduct : Product = {
      id = productId;
      name = product.name;
      description = product.description;
      price = product.price;
      category = product.category;
      imageUrl = product.imageUrl;
    };

    products.add(productId, newProduct);

    let productList = switch (productsByCategory.get(product.category)) {
      case (null) { List.empty<Product>() };
      case (?list) { list };
    };
    productList.add(newProduct);
    productsByCategory.add(product.category, productList);
  };

  public query func getProductById(productId : ProductId) : async ?Product {
    products.get(productId);
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    switch (productsByCategory.get(category)) {
      case (null) { [] };
      case (?list) { list.values().toArray() };
    };
  };

  public query func getProductsBySearch(searchText : Text) : async [Product] {
    let filteredMap = products.filter(
      func(_key, product) {
        product.name.contains(#text searchText);
      }
    );
    filteredMap.values().toArray();
  };

  public query func getProductsBySearchAndCategory(searchText : Text, category : Text) : async [Product] {
    let filteredMap = products.filter(
      func(_key, product) {
        product.name.contains(#text searchText) and product.category.contains(#text category);
      }
    );
    filteredMap.values().toArray();
  };

  public shared ({ caller }) func placeOrder(userId : UserId, items : [(ProductId, Nat)], totalPrice : Nat) : async () {
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      userId;
      items;
      totalPrice;
    };
    orders.add(orderId, order);
  };

  public query func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public query ({ caller }) func getMyOrders(userId : UserId) : async [Order] {
    let filteredMap = orders.filter(
      func(_key, order) {
        order.userId == userId;
      }
    );
    filteredMap.values().toArray();
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductCount() : async Nat {
    products.size();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
