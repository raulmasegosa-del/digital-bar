import { createOrder } from "./createOrder";
import { getActiveOrder } from "./getActiveOrder";
import { getOrder } from "./getOrder";
import { updateOrderStatus } from "./updateOrderStatus";

export class OrderService {
  static create = createOrder;

  static get = getOrder;

  static getActive = getActiveOrder;

  static updateStatus =
    updateOrderStatus;
}