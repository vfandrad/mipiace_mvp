def process_n8n_order(order_data: dict, db):
    """
    Cria o pedido validando os preços reais dos produtos (sem campo de detalhes/descrição).
    """
    items = order_data.get("items", [])
    if not items:
        raise ValueError("O pedido precisa ter pelo menos um item.")

    product_ids = [item['product_id'] for item in items]
    
    # Busca produtos no banco para validar preços
    products_res = db.table("products").select("id, price").in_("id", product_ids).execute()
    db_prices = {p['id']: p['price'] for p in products_res.data}

    total_price = 0
    items_to_insert = []

    for item in items:
        if item['product_id'] not in db_prices:
            raise ValueError(f"Produto {item['product_id']} não encontrado.")
            
        unit_price = db_prices[item['product_id']]
        subtotal = unit_price * item['quantity']
        total_price += subtotal
        
        items_to_insert.append({
            "product_id": item['product_id'],
            "quantity": item['quantity'],
            "unit_price": unit_price
        })

    # Insere Pedido Pai
    order_insert = {
        "customer_name": order_data.get('customer_name', 'Cliente n8n'),
        "customer_phone": order_data.get('customer_phone'),
        "total_price": total_price,
        "status": "novo",
        "payment_status": "pendente"
    }
    
    new_order = db.table("orders").insert(order_insert).execute()
    order_id = new_order.data[0]['id']

    # Vincula o ID do pedido nos itens e insere
    for i in items_to_insert:
        i['order_id'] = order_id
        
    db.table("order_items").insert(items_to_insert).execute()

    return new_order.data[0]