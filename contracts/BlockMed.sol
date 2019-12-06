// Nome: Lucas Lucena
// Nome: Paulo César
// Conta do contrato:

pragma  solidity  ^0.4.25; // Fique a vontade caso queira utilizar outra versão.

contract BlockMed {
    struct exam {
        string tokens;
        byte[] image;
    }
    struct client {
        address holder;                   //Endereço ethereum do paciente
        string name;                      //Nome
        string age;                         //Idade
        string bloodType;
        uint exam_id;                     //Ultimo exame
        string allergies;               //Lista de alergias 
        mapping(uint => string) diagnosis; //Historico de doenças do paciente, dizendo se está curado ou em tratamento
        mapping(uint => exam) exams;
    }
    
    struct pro_client{
        address holder;          //Endereço ethereum do paciente
        string name;             //Nome
        string registro;         //Nome
        address[] clients;      //clientes
    }

    mapping(address => pro_client) private medics;
    mapping(address => pro_client) private labs;
	mapping(address => client) private clients;
	mapping(address => address) private admins;
	address owner;
    
    constructor() public {
		owner =  msg.sender;
	}
    
	modifier onlyOwner {
		require(msg.sender == owner, "Somente o dono do contrato pode invocar essa função!");
		_;
	}
	
	modifier onlyAdmin {
		require(admins[msg.sender] != 0, "Somente o administradores do contrato podem invocar essa função!");
		_;
	}
	
	modifier onlyPro {
		require(medics[msg.sender].holder != 0 || labs[msg.sender].holder != 0 , "Somente o medicos ou laboratorios podem invocar essa função!");
		_;
	}
	
	function isClient(address adrs) external view returns (bool) {
	    if(clients[adrs].holder != 0) return true;
	    return false;
	}
	
	function isMedic() external view returns (bool) {
	    if(medics[msg.sender].holder != 0) return true;
	    return false;
	}
	
	function isLab() external view returns (bool) {
	    if(labs[msg.sender].holder != 0) return true;
	    return false;
	}
	
	function add_admin(address adm) onlyOwner external {
	    admins[adm] = adm;
	}
    
    function add_lab(address lab, string name) onlyAdmin external {
	    pro_client storage pro_c = labs[lab];
	    pro_c.holder = lab;
	    pro_c.name = name;
	}
    
    function add_medic(address med, string name) onlyAdmin external {
	    pro_client storage pro_c = medics[med];
	    pro_c.holder = med;
	    pro_c.name = name;
	}
	
	function add_client(address client_, string name, string age, string bt, string allergies) onlyPro external {
	    client storage c = clients[client_];
	    c.holder = client_;
	    c.name = name;
	    c.age = age;
	    c.allergies = allergies;
	    c.bloodType = bt;
	    //this.add_client2me(client_);
	}
	
	function add_client2me(address client_) onlyPro external {
	    pro_client storage pro_c = medics[msg.sender];
	    if(pro_c.holder == 0){ pro_c = labs[msg.sender]; }
	    pro_c.clients.push(client_);
	}
	
	function diagnose(address client_, string diag) onlyPro external {
	    client storage c = clients[client_];
	    c.diagnosis[c.exam_id] = diag;
	}
	
	function changeAge(address client_, string age) onlyPro external {
	    pro_client storage pro_c = medics[msg.sender];
	    require(pro_c.holder != 0, "Apenas medicos.");
	    client storage c = clients[client_];
	    c.age = age;
	}
	
	function changeAllergies(address client_, string allergies) onlyPro external {
	    pro_client storage pro_c = medics[msg.sender];
	    require(pro_c.holder != 0, "Apenas medicos.");
	    client storage c = clients[client_];
	    c.allergies = allergies;
	}
	
	/*function addExam(address client_, string tokens, byte[] img) onlyPro external {
	    client storage c = clients[client_];
	    exam storage exam_ = c.exams[c.exam_id];
	    exam_.tokens = tokens;
	    exam_.image = img;
	    c.exam_id++;
	}
	
	function getExam(address client_, uint id) onlyPro external view returns (byte[]){
	    pro_client storage pro_c = medics[msg.sender];
	    require(pro_c.holder != 0, "Apenas medicos.");
	    client storage c = clients[client_];
	    exam storage exam_ = c.exams[id];
	    return exam_.image;
	}*/
	
	function addExam(address client_, string tokens) onlyPro external {
	    client storage c = clients[client_];
	    exam storage exam_ = c.exams[c.exam_id];
	    exam_.tokens = tokens;
	    //exam_.image = img;
	    c.exam_id++;
	}
	
	function getExam(address client_, uint id) onlyPro external view returns (string){
	    pro_client storage pro_c = medics[msg.sender];
	    require(pro_c.holder != 0, "Apenas medicos.");
	    client storage c = clients[client_];
	    exam storage exam_ = c.exams[id];
	   // return exam_.image;
	   return exam_.tokens;
	}
	
	function getClient(address adr) external view returns (string) {
	    client storage c = clients[adr];
	    string memory s = c.name;
	    string memory token = "::";
	    
	    s=concat(s,token);
	    
	    s=concat(s,c.age);
	    s=concat(s,token);
	    
	    s=concat(s,c.bloodType);
	    s=concat(s,token);
	    
	    s=concat(s,uintToString(c.exam_id));
	    s=concat(s,token);
	    
	    s=concat(s,c.allergies);
	   
	    return s;
    }
	
	function getMedic() external view returns (string) {
	    pro_client storage pro_c = medics[msg.sender];
	    return pro_c.name;
    }
    
    function getPacientsMed() external view returns (address[]) {
	    pro_client storage pro_c = medics[msg.sender];
	    return pro_c.clients;
    }
    
    function getPacientsLab() external view returns (address[]) {
	    pro_client storage pro_c = labs[msg.sender];
	    return pro_c.clients;
    }
    
    function getLab() external view returns (string) {
	    pro_client storage pro_c = labs[msg.sender];
	    return pro_c.name;
    }
    
    
    //AUX
    function uintToString(uint v) private pure returns (string) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        return string(s);
    }
    
    function concat(string _base, string _value) private pure returns (string) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        bytes memory _newValue = new bytes(_baseBytes.length + _valueBytes.length);
        uint i;
        uint j;

        for(i=0; i<_baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for(i=0; i<_valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }
        
        return string(_newValue);
    }
    
}