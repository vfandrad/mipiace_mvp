def process_n8n_order(order_data: dict, db):
    # 1. Salva o Pedido (Tabela orders)
    end = order_data.get("endereco", {})
    order_res = db.table("orders").insert({
        "customer_name": order_data.get("customer_name"),
        "customer_phone": order_data.get("customer_phone"),
        "total_price": order_data.get("total_price"),
        "rua": end.get("rua"),
        "numero": end.get("numero"),
        "bairro": end.get("bairro"),
        "complemento_endereco": end.get("complemento"),
        "status": "novo"
    }).execute()

    order_id = order_res.data[0]['id']

    # 2. Salva os Itens (Tabela order_items)
    items_to_insert = []
    for item in order_data.get("items", []):
        items_to_insert.append({
            "order_id": order_id,
            "product_id": item.get("product_id"),
            "quantity": item.get("quantity", 1),
            "complement_ids": item.get("selected_complement_ids", []), # JSONB aqui
            "details": item.get("details")
        })

    if items_to_insert:
        db.table("order_items").insert(items_to_insert).execute()

    return order_res.data[0]