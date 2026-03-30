import re

def clean_whatsapp_number(phone: str) -> str:
    """
    Limpa o número de telefone vindo da Evolution API/n8n.
    Remove '+', espaços, traços e o sufixo do WhatsApp.
    Ex: '5511999999999@s.whatsapp.net' vira '5511999999999'
    """
    if not phone:
        return ""
    
    # Remove o sufixo do whatsapp se existir
    phone = phone.replace("@s.whatsapp.net", "")
    
    # Remove tudo que não for número (RegEx)
    clean_num = re.sub(r'\D', '', phone)
    
    return clean_num

def format_n8n_response(status: str, message: str, order_data: dict = None) -> dict:
    """
    Padroniza a resposta que a FastAPI devolve para o n8n.
    Isso facilita muito a criação do nó 'Switch' no final do fluxo do n8n.
    """
    response = {
        "status": status, # Ex: 'success', 'error', 'need_info'
        "ai_message_output": message # O texto que o n8n deve mandar pro cliente
    }
    
    if order_data:
        response["order_data"] = order_data
        
    return response

def extract_intent_from_groq(ai_json_output: dict) -> str:
    """
    Mapeia a intenção que a IA Groq identificou.
    Garante que a API não quebre se a IA mandar uma intenção não mapeada.
    """
    valid_intents = ["add_item", "remove_item", "checkout", "doubt", "cancel"]
    
    intent = ai_json_output.get("intent", "doubt")
    
    if intent not in valid_intents:
        return "doubt" # Se a IA alucinar, tratamos como dúvida geral
        
    return intent