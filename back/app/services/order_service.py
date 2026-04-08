def process_n8n_order(order_data: dict, db):
    """
    Apenas recebe os dados mastigados do n8n e salva no banco.
    """
    # 1. Extrai os dados do pedido pai
    customer_name = order_data.get("customer_name")
    customer_phone = order_data.get("customer_phone")
    total_price = order_data.get("total_price") # Já vem calculado do n8n
    items = order_data.get("items", [])

    # 2. Insere na tabela 'orders'
    order_res = db.table("orders").insert({
        "customer_name": customer_name,
        "customer_phone": customer_phone,
        "total_price": total_price,
        "status": "novo",
        "payment_status": "pendente"
    }).execute()
    
    order_id = order_res.data[0]['id']

    # 3. Prepara os itens para a tabela 'order_items'
    items_to_insert = []
    for i in items:
        items_to_insert.append({
            "order_id": order_id,
            "product_id": i['product_id'],
            "quantity": i['quantity'],
            "details": i.get("details") # Sabores/Obs vindos da IA
        })
    
    # 4. Insere todos os itens de uma vez
    db.table("order_items").insert(items_to_insert).execute()

    return order_res.data[0]