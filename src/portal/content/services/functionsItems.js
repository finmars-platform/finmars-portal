(function () {

    const functionsItems = [
		{
			"name": "Name",
			"description": "[instrument].name: Text - name for instrument<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.name - if name of variable is [instrument]<br/>instr.name  - if name of variable is [instr]",
			"groups": "instr",
			"func": ".name",
			"validation": {
				"func": "[instrument].name"
			}
		},
		{
			"name": "Short name",
			"description": "[instrument].short_name: Text - system short name for instrument<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.short_name - if name of variable is [instrument]<br/>instr_2000.short_name - if name of variable is [instr_2000]",
			"groups": "instr",
			"func": ".short_name",
			"validation": {
				"func": "[instrument].short_name"
			}
		},
		{
			"name": "User code",
			"description": "[instrument].user_code: Text - system unique user code for instrument<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.user_code - if name of variable is [instrument]<br/>instr_2000.user_code - if name of variable is [instr_2000]",
			"groups": "instr",
			"func": ".user_code",
			"validation": {
				"func": "[instrument].user_code"
			}
		},
		{
			"name": "Name",
			"description": "[account].name: Text - name for account<br/><br/>[account]: Account - variable contains account (account unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (account) via these functions<br/><br/>Examples: <br/>account.name - if name of variable is [account]<br/>acc.name  - if name of variable is [acc]",
			"groups": "account",
			"func": ".name",
			"validation": {
				"func": "[account].name"
			}
		},
		{
			"name": "Short name",
			"description": "[account].short_name: Text - system short name for account<br/><br/>[account]: Account - variable contains account (account unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (account) via these functions<br/><br/>Examples: <br/>account.short_name - if name of variable is [account]<br/>acc.short_name - if name of variable is [acc]",
			"groups": "account",
			"func": ".short_name",
			"validation": {
				"func": "[account].short_name"
			}
		},
		{
			"name": "User code",
			"description": "[account].user_code: Text - system unique user code for account<br/><br/>[account]: Account - variable contains account (account unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (account) via these functions<br/><br/>Examples: <br/>account.user_code - if name of variable is [account]<br/>acc.user_code - if name of variable is [acc]",
			"groups": "account",
			"func": ".user_code",
			"validation": {
				"func": "[account].user_code"
			}
		},
		{
			"name": "Name",
			"description": "[portfolio].name: Text - name for portfolio<br/><br/>[portfolio]: Portfolio - variable contains portfolio (portfolio unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (portfolio) via these functions<br/><br/>Examples: <br/>portfolio.name - if name of variable is [portfolio]<br/>prtf.name  - if name of variable is [prtf]",
			"groups": "portfolio",
			"func": ".name",
			"validation": {
				"func": "[portfolio].name"
			}
		},
		{
			"name": "Short name",
			"description": "[portfolio].short_name: Text - system short name for portfolio<br/><br/>[portfolio]: Portfolio - variable contains portfolio (portfolio unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (portfolio) via these functions<br/><br/>Examples: <br/>portfolio.short_name - if name of variable is [portfolio]<br/>prtf.short_name - if name of variable is [prtf]",
			"groups": "portfolio",
			"func": ".short_name",
			"validation": {
				"func": "[portfolio].short_name"
			}
		},
		{
			"name": "User code",
			"description": "[portfolio].user_code: Text - system unique user code for portfolio<br/><br/>[portfolio]: Portfolio - variable contains portfolio (portfolio unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (portfolio) via these functions<br/><br/>Examples: <br/>portfolio.user_code - if name of variable is [portfolio]<br/>prtf.user_code - if name of variable is [prtf]",
			"groups": "portfolio",
			"func": ".user_code",
			"validation": {
				"func": "[portfolio].user_code"
			}
		},
		{
			"name": "Name",
			"description": "[responsible].name: Text - name for responsible<br/><br/>[responsible]: Responsible - variable contains responsible (responsible unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (responsible) via these functions<br/><br/>Examples: <br/>responsible.name - if name of variable is [responsible]<br/>resp.name  - if name of variable is [resp]",
			"groups": "responsible",
			"func": ".name",
			"validation": {
				"func": "[responsible].name"
			}
		},
		{
			"name": "Short name",
			"description": "[responsible].short_name: Text - system short name for responsible<br/><br/>[responsible]: Responsible - variable contains responsible (responsible unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (responsible) via these functions<br/><br/>Examples: <br/>responsible.short_name - if name of variable is [responsible]<br/>resp.short_name - if name of variable is [resp]",
			"groups": "responsible",
			"func": ".short_name",
			"validation": {
				"func": "[responsible].short_name"
			}
		},
		{
			"name": "User code",
			"description": "[responsible].user_code: Text - system unique user code for responsible<br/><br/>[responsible]: Responsible - variable contains responsible (responsible unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (responsible) via these functions<br/><br/>Examples: <br/>responsible.user_code - if name of variable is [responsible]<br/>resp.user_code - if name of variable is [resp]",
			"groups": "responsible",
			"func": ".user_code",
			"validation": {
				"func": "[responsible].user_code"
			}
		},
		{
			"name": "Name",
			"description": "[counterparty].name: Text - name for counterparty<br/><br/>[counterparty]: Counterparty - variable contains counterparty  (counterparty unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (counterparty) via these functions<br/><br/>Examples: <br/>counterparty.name - if name of variable is [counterparty]<br/>ctpy.name  - if name of variable is [ctpy]",
			"groups": "counterparty",
			"func": ".name",
			"validation": {
				"func": "[counterparty].name"
			}
		},
		{
			"name": "Short name",
			"description": "[counterparty].short_name: Text - system short name for counterparty<br/><br/>[counterparty]: Counterparty - variable contains counterparty (counterparty unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (counterparty) via these functions<br/><br/>Examples: <br/>counterparty.short_name - if name of variable is [counterparty]<br/>ctpy.short_name - if name of variable is [ctpy]",
			"groups": "counterparty",
			"func": ".short_name",
			"validation": {
				"func": "[counterparty].short_name"
			}
		},
		{
			"name": "User code",
			"description": "[counterparty].user_code: Text - system unique user code for counterparty<br/><br/>[counterparty]: Counterparty - variable contains counterparty counterparty unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (counterparty) via these functions<br/><br/>Examples: <br/>counterparty.user_code - if name of variable is [counterparty]<br/>ctpy.user_code - if name of variable is [ctpy]",
			"groups": "counterparty",
			"func": ".user_code",
			"validation": {
				"func": "[counterparty].user_code"
			}
		},
		{
			"name": "System Entities",
			"description": "The System Entities are the fundamental elements of FinMARS. They include:<br/>- Portfolio<br/>- Account<br/>- Instrument<br/>- Counterparty<br/>- Responsible<br/>- Currency<br/>- Transactions<br/><br/>The user can address any parameter of the System Entities used in the code of the Expression Builder.<br/>For example, if [instr]:Instrument, the user can get [instr] parameter called 'Accrued Price Multiplier' by typing instr.accrued_multiplier. <br/>The list of parameters is provided separately for each entity.",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Instrument",
			"description": "System entity Instrument include these attributes-parameters:<br/>- user_code<br/>- name<br/>- short_name<br/>- pricing_currency.name<br/>- pricing_currency.user_code<br/>- reference_for_pricing<br/>- price_multiplier<br/>- accrued_currency.user_code<br/>- accrued_currency.name<br/>- accrued_multiplier<br/>- default_price<br/>- default_accrued<br/>- maturity_date<br/>- maturity_price<br/><br/>The user can get these parameters for each instrument by using expression [instrument].name_of_parameter where [instrument] is a variable contains instrument (see examples for Instrument)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Portfolio",
			"description": "System entity Portfolio include these attributes-parameters:<br/>- user_code<br/>- name<br/>- short_name<br/><br/>The user can get these parameters for each instrument by using expression [portfolio].name_of_parameter where [portfolio] is a variable contains portfolio (see examples for portfolio)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Account",
			"description": "System entity Account include these attributes-parameters:<br/>- user_code<br/>- name<br/>- short_name<br/>- public_name<br/><br/>The user can get these parameters for each account by using expression [account].name_of_parameter where [account] is a variable contains account (see examples for account)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Responsible",
			"description": "System entity Responsible include these attributes-parameters:<br/>- user_code<br/>- name<br/>- short_name<br/><br/>The user can get these parameters for each responsible by using expression [responsible].name_of_parameter where [responsible] is a variable contains responsible (see examples for responsible)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Counterparty",
			"description": "System entity Counterparty include these attributes-parameters:<br/>- user_code<br/>- name<br/>- short_name<br/><br/>The user can get these parameters for each counterparty by using expression [counterparty].name_of_parameter where [counterparty] is a variable contains counterparty (see examples for counterparty)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Currency",
			"description": "System entity Currency include these attributes-parameters:<br/>- user_code<br/>- name<br/>- reference_for_pricing<br/><br/>The user can get these parameters for each currency by using expression [currency].name_of_parameter where [currency] is a variable contains currency (see examples for currency)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Transaction",
			"description": "System entity Transactions include these attributes-parameters:<br/><br/>- instrument (via request of it`s parameter):<br/> instrument.user_code<br/> instrument.name<br/> instrument.short_name<br/> instrument.maturity_date<br/><br/>- portfolio (via request of it`s parameter):<br/> portfolio.user_code<br/> portfolio.name<br/> portfolio.short_name<br/> <br/>- account_position (via request of it`s parameter):<br/> account_position.user_code<br/> account_position.name<br/> account_position.short_name<br/> account_position.public_name<br/><br/>- account_cash (via request of it`s parameter):<br/> account_cash.user_code<br/> account_cash.name<br/> account_cash.short_name<br/> account_cash.public_name<br/><br/>- account_interim (via request of it`s parameter):<br/> account_interim.user_code<br/> account_interim.name<br/> account_interim.short_name<br/> account_interim.public_name<br/><br/>- responsible (via request of it`s parameter):<br/> responsible.user_code<br/> responsible.name<br/> responsible.short_name<br/><br/>- counterparty (via request of it`s parameter):<br/> counterparty.user_code<br/> counterparty.name<br/> counterparty.short_name<br/><br/>- accounting_date<br/><br/>- cash_date<br/><br/>- transaction_currency<br/>  name<br/>  user_code<br/><br/>- settlement_currency<br/>  name<br/>  user_code<br/><br/>- position_size_with_sign<br/>- principal_with_sign<br/>- carry_with_sign<br/>- overheads_with_sign<br/>- position_size_with_sign<br/>- cash_consideration<br/><br/>- notes<br/><br/>The user can get these parameters for described transaction by using expression transactions[0].name_of_parameter (see examples for Transactions)",
			"groups": "data_types",
			"func": "System Entities",
			"validation": {
				"func": "System Entities"
			}
		},
		{
			"name": "Strategy 1",
			"description": "[strategy1] :: [Result: Strategy]<br/><br/>[Result: Strategy]:  Strategy - variable autofilled from the Context (see Context Variables / Context).  The variable stores the Strategy 1 of the selected Context.",
			"groups": "context_var",
			"func": "strategy1",
			"validation": {
				"func": "strategy1"
			}
		},
		{
			"name": "Get Instrument User attribute value",
			"description": "get_instrument_user_attribute_value([instrument], [User_attribute_reference_name]) :: [Result: attribute value of instrument]<br/><br/>[instrumnet]: String - user code of the instrument<br/>[User_attribute_reference_name]: String - user attribute reference name<br/><br/>[Result: attribute value of instrument]: String, number, date - as attribite value of instrument<br/><br/>Examples:<br/><br/>Get_instrument_User_attribute_value(instrument, user_attr_1) - where instrument and user_attr_1 are variables with names of both parameteres<br/>Get_instrument_User_attribute_value('Angola_2025', 'Area') - where names of both parameteres are specified directly<br/>",
			"groups": "instr",
			"func": "get_instrument_user_attribute_value([instrument], [User_attribute_reference_name])",
			"validation": {
				"func": "get_instrument_user_attribute_value([instrument], [User_attribute_reference_name])"
			}
		},
		{
			"name": "Get principal price of Instrument",
			"description": "get_principal_price([date],[instrument], [policy], [default_value]) :: [Result: principal price of instrument]<br/><br/>[Result: principal price]: Number - principal price of instrument on specified date and policy<br/>[date] - needed date contained in variable or text (for exapmle tr_date or '2019-01-01')<br/>[instrument] - user_code of instrument contained in variable or text (for exapmle instrument or 'US0378331005')<br/>[policy] - pricing policy for price calculation (for example 'default')<br/>[default_value] - result of function in case of empty price data on specified date (for example 0, 100, 1)<br/><br/>Examples:<br/>get_principal_price('2019-04-29', US0378331005', '-', 100)<br/>get_principal_price(tr_date, instrument, 'default', 0)",
			"groups": "prices",
			"func": "get_principal_price([date],[instrument], [policy], [default_value])",
			"validation": {
				"func": "get_principal_price([date],[instrument], [policy], [default_value])"
			}
		},
		{
			"name": "Get accrued price of Instrument",
			"description": "get_accrued_price([date],[instrument], [policy], [default_value]) :: [Result: accrued price of instrument]<br/><br/>[Result: accruedprice]: Number - accrued price of instrument on specified date and policy<br/>[date] - needed date contained in variable or text (for exapmle tr_date or '2019-01-01')<br/>[instrument] - user_code of instrument contained in variable or text (for exapmle instrument or 'US0378331005')<br/>[policy] - pricing policy for price calculation (for example 'default')<br/>[default_value] - result of function in case of empty price data on specified date (for example 0, 0.01)<br/><br/>Examples:<br/>get_accrued_price('2019-04-29', US0378331005', '-', 100)<br/>get_accrued_price(tr_date, instrument, 'default', 0)",
			"groups": "prices",
			"func": "get_accrued_price([date],[instrument], [policy], [default_value])",
			"validation": {
				"func": "get_accrued_price([date],[instrument], [policy], [default_value])"
			}
		},
		{
			"name": "Convert to system number",
			"description": "convert_to_number([number], [separator], [decimal], [braces_boolean]): [Result: number in system format]<br/><br/>[Result: number in system format]: Number in system format - number that can be used in system calculations<br/>[number]:String - number written as text (for example price_instr or '101,95')<br/>[separator] - separator (for example ''' or ' ' )<br/>[decimal] - decimal (for example ',' or '.')<br/>[braces_boolean] - boolean for negative numbers in braces  (for example true or false)<br/><br/>Examples:<br/>convert_to_number(num, ' ', ',', true) - to convert a number in variable [num] written like 112 230,56<br/>convert_to_number(num, ''', '.', true) - to convert a number in variable [num] written like (113'230.56)<br/>convert_to_number('-113'230.56', ''', '.', false) - to convert a number stricktly added in function",
			"groups": "text",
			"func": "convert_to_number([number], [separator], [decimal], [braces_boolean])",
			"validation": {
				"func": "convert_to_number([number], [separator], [decimal], [braces_boolean])"
			}
		},
		{
			"name": "Convert Number to Days",
			"description": "[date]+days([number]) :: [Result: date_after]<br/>[date]-days([number]) :: [Result: date_before]<br/><br/>[Result: date_after, date_before]: Date - date differs from [date] by [number] calendar days<br/><br/>[date]: Date - any date variable, used by user in this expression (eg, transaction_date)<br/>[number]: Number - any number or number variable, used by user in this expression (eg, 1, 2, 3... or number_variable)<br/><br/>Examples:<br/>transaction_date+days(2) - for getting date, which differs from transaction date by 2 days<br/>deposit_date+days(duration) - for getting date, which differs from deposit_date by number of days, which is written in variable with name [duration]<br/>now()-days(10)- for getting date, which differs from current date by 10 days<br/>now()+days(rent_period)- for getting date, which differs from current date by number of days, which is written in variable with name [rent_period]<br/>",
			"groups": "date",
			"func": "days([number])",
			"validation": {
				"func": "days([number])"
			}
		},
		{
			"name": "Get today's Date",
			"description": "now() :: [Result: current date]<br/><br/>[Result: current date]: Date - date when the function was triggered. This function can be used as an attribute of transaction (for example as a default transaction date) or as a parameter of other function - for example for converting current date to string to write it to any string variable).<br/><br/>Examples:<br/>now() - to get a current date as a date object<br/>str(now()) - to get a current date as a string, in system format it returns string '2018-01-01' for current date 2018-01-01",
			"groups": "date",
			"func": "now()",
			"validation": {
				"func": "now()"
			}
		},
		{
			"name": "Convert String to Date",
			"description": "parse_date([date_string], [format='%Y-%m-%d'])  :: [Result: date]<br/><br/>[Result: date]: Date - date as a date object, converted from string object<br/>This function may be used in:<br/>- importing any objects (transactions, accounts, portfolio) with date attributes<br/>- converting string attributes to date attributes<br/><br/>[date_string]: String - string with date in text format<br/>[format]: String - reflects format in which [date_string] is written<br/><br/>Examples: <br/>parse_date(string_variable, format='%Y-%m-%d') for string variable with name string_variable, which contains this text - 2018-01-01<br/>parse_date(string_variable, format='%d-%m-%Y') for this text - 01-01-2018<br/>parse_date(string_variable, format='%Y/%m/%d') for this text - 2018/01/01<br/>parse_date(string_variable, format='%d.%m.%Y') for this text - 01.01.2018<br/>parse_date(string_variable, format='%Y.%m.%d') for this text - 2018.01.01<br/><br/>parse_date('18.01.01', format='%y.%m.%d') for this text - 18.01.01<br/>parse_date('2018/September/01', format='%Y/%B/%d') for this text - 2018/September/01<br/>parse_date('01/September/18', format='%d/%b/%Y') for this text - 01/September/2018",
			"groups": "date",
			"func": "parse_date([date_string], [format='%Y-%m-%d'])",
			"validation": {
				"func": "parse_date([date_string], [format='%Y-%m-%d'])"
			}
		},
		{
			"name": "Convert Unix Time to Date",
			"description": "unix_to_date([unix_time], [format='%Y-%m-%d'])  :: [Result: date]<br/><br/>[Result: date]: Date - date as a date object, converted from string object<br/>This function may be used in:<br/>- importing any objects (transactions, accounts, portfolio) with date attributes<br/>- converting string attributes to date attributes<br/><br/>[unix_time]: Int - Unix Date<br/>[format]: String - reflects format in which [date_string] is written<br/><br/>",
			"groups": "date",
			"func": "unix_to_date([unix_time], [format='%Y-%m-%d'])",
			"validation": {
				"func": "unix_to_date([unix_time], [format='%Y-%m-%d'])"
			}
		},

		{
			"name": "Date plus/minus N days",
			"description": "[date]+days([number]) :: [Result: date_after]<br/>[date]-days([number]) :: [Result: date_before]<br/><br/>[Result: date_after, date_before]: Date - date differs from [date] by [number] calendar days<br/><br/>[date]: Date - any date variable, used by user in this expression (eg, transaction_date)<br/>[number]: Number - any number or number variable, used by user in this expression (eg, 1, 2, 3... or number_variable)<br/><br/>Examples:<br/>transaction_date+days(2) - for getting date, which differs from transaction date by 2 days<br/>deposit_date+days(duration) - for getting date, which differs from deposit_date by number of days, which is written in variable with name [duration]<br/>now()-days(10)- for getting date, which differs from current date by 10 days<br/>now()+days(rent_period)- for getting date, which differs from current date by number of days, which is written in variable with name [rent_period]<br/>",
			"groups": "date",
			"func": "[date]+days([number])",
			"validation": {
				"func": "[date]+days([number])"
			}
		},
		{
			"name": "Date plus/minus N Work-days",
			"description": "add_workdays([date],[number_workdays]) :: [Result: date_plus_workdays]<br/><br/>[Result: date_plus_workdays]: Date - date differs from [date] by [number_workdays] working days<br/><br/>[date] - any date variable, used by user in this expression (eg, issue_date)<br/>[number_workdays] - any number or number variable, used by user in this expression (eg, 1, 2, 3... or number_variable)<br/><br/>Examples:<br/>add_workdays(now(), 30) - for getting date, which differs from current date by 30 working days<br/>add_workdays(tr_date, 100) - for getting date, which differs from date written in date variable with name [tr_date] by 100 working days<br/>add_workdays(instrument.maturity_date, delay_period) - for getting date, which differs from date in instrument parameter [maturity_date] by number of working days, which is written in variable with name [delay_period]",
			"groups": "date",
			"func": "add_workdays([date],[number_workdays])",
			"validation": {
				"func": "add_workdays([date],[number_workdays])"
			}
		},
		{
			"name": "Get random number",
			"description": "random() :: [Result: number]<br/><br/>[Result: number]: Number - random number generated by the system (range of returned value =  0.0-1.0). It can be used in constructing any notes, user codes of entities.<br/><br/>Examples:<br/>random()<br/>random()*10<br/>random()+5<br/>coupon_size-random() - where coupon_size is any number variable used by user in his expressions",
			"groups": "number",
			"func": "random()",
			"validation": {
				"func": "random()"
			}
		},
		{
			"name": "Get minimum number",
			"description": "min([number_1], [number_2]) :: [Result: minimum_number - [number_1] or [number_2]]<br/><br/>[Result: minimum_number]: Number - minimum number of the set of numbers in [number_1] and  [number_2] <br/><br/>[number_1],[number_2]: Number - any numbers or number variables used in system<br/><br/>Examples:<br/>min(price, 100) - to get a minimum number from the set of two numbers - 100 and a number in variable with name [price]<br/>min(5, 10) - to get a minimum number from this set (5 in this example)<br/>min(current_price, target_price) - to get a minimum of numbers written in variables with names [current_price] and [target_price]",
			"groups": "number",
			"func": "min([number_1], [number_2])",
			"validation": {
				"func": "min([number_1], [number_2])"
			}
		},
		{
			"name": "Get maximum number",
			"description": "max([number_1], [number_2]) :: [Result: maximum_number - [number_1] or [number_2]]<br/><br/>[Result:  maximum_number]: Number - maximum number of the set of numbers in [number_1] and  [number_2] <br/><br/>[number_1],[number_2]: Number - any numbers or number variables used in system<br/><br/>Examples:<br/>max(price_factor, 1) - to get a maximum number from the set of two numbers - 1 and a number in variable with name [price_factor]<br/>max(maturity_price, trade_price) - to get a maximum of numbers written in variables with names [maturity_price] and [trade_price]",
			"groups": "number",
			"func": "max([number_1], [number_2])",
			"validation": {
				"func": "max([number_1], [number_2])"
			}
		},
		{
			"name": "Round number with decimals",
			"description": "round([number],[decimals_number]) :: [Result: rounded_number]<br/><br/>[Result: rounded_number]: Number - rounded number (by math rule). For example, 23.5 gets rounded to 24, and −23.5 gets rounded to −24.<br/><br/>[number]: Number - any number or number variable, used by user in this expression (eg, 1.17, 1.56, 1.9987... or number_variable)<br/>[decimals_number]: Number - optional parameter - number of decimals, needed after rounding. User may not skip writing default value (0) in this function<br/><br/>Examples:<br/>round(23.5) for getting rounded result 24<br/>round(price) for getting rounded price of instrument written in variable with name [price]<br/>round(price,2) for getting rounded price with 2 decimals after rounding",
			"groups": "number",
			"func": "round([number],[decimals_number])",
			"validation": {
				"func": "round([number],[decimals_number])"
			}
		},
		{
			"name": "Truncate Decimals",
			"description": "trunc([number]) :: [Result: truncated_number]<br/><br/>[Result: truncated_number]: Number - number without decimals (truncated number). For example, 13.2 gets truncated to 13, and 13.99999 gets truncated also to 13 (without using math rules of rounding.<br/><br/>[number]: Number - any number or number variable, used by user in this expression (eg, 2.37, 5.687... or number_variable)<br/><br/>Examples:<br/>trunc(23.5) for getting truncated result 23<br/>trunc(price) for getting truncated price of instrument written in variable with name [price]",
			"groups": "number",
			"func": "trunc([number])",
			"validation": {
				"func": "trunc([number])"
			}
		},
		{
			"name": "Compare numbers",
			"description": "isclose([number_1], [number_2]) :: [Result: equality_boolean]<br/><br/>[Result: equality_boolean]: Boolean - True or False. In case of equality [number_1] and [number_2] result of this function is 'True', otherwise the result is 'False'. This function can be used as a parameter of other functions, for example user can compare coupon size of some instrument with target and use the result of it in other function. <br/><br/>[number_1],[number_2]: Number - any number or variable used in system<br/><br/>Examples:<br/>isclose(maturity_price, 100) - to compare number written in variable with name [maturity_price] with 100<br/>isclose (5, 5) - to compare two equal numbers (5) - the result is 'True' <br/>isclose(current_price, target_price) - to compare numbers written in variables with names [current_price] and [target_price]",
			"groups": "number",
			"func": "isclose([number_1], [number_2])",
			"validation": {
				"func": "isclose([number_1], [number_2])"
			}
		},
		{
			"name": "Convert String to Number",
			"description": "int([string]) :: [Result: number_from_string]<br/><br/>[Result: number_from_string]: Number - number converted from string. For example, '10' gets converted to 10 as a number data, and '13.999' gets converted to 13. This function is used to convert any string variables (for example notes, where user can wrote numbers, but for the system it is still string data)<br/><br/>[string] - any string or string variable, used by user in this expression<br/><br/>Examples:<br/>int('25') for getting data as a number object 25<br/>float('25.09') for getting data as a number object 25.09<br/>int(notes) for getting data as a number object from string variable with name [notes]<br/>float(notes) for getting data as a number object from string variable with name [notes]",
			"groups": "number",
			"func": "int([string])",
			"validation": {
				"func": "int([string])"
			}
		},
		{
			"name": "Get absolute value of number",
			"description": "abs([number]) :: [Result: absolute_number]<br/><br/>[Result: absolute_number]: Number - absolute number without sign. For example, -11.5 gets absolute number 11.5<br/><br/>[number]: Number - any number or number variable, used by user in this expression<br/><br/>Examples:<br/>abs(-10.599) for getting result 10.599<br/>abs(change_price) for getting absolute change of price written in variable with name [change_price]",
			"groups": "number",
			"func": "abs([number])",
			"validation": {
				"func": "abs([number])"
			}
		},
		{
			"name": "Get value depends on logical test",
			"description": "iff([any_variable]==[user_target], [returned_value_if_true], [returned_value_if_false]) :: [Result: returned_value_if_true or returned_value_if_false]<br/><br/>[Result: returned_value_if_true or returned_value_if_false]: String, date, boolean or number - as a value or variable contains any value. In case of true result of [any_variable]==[user_target] the system returns [returned_value_if_true], otherwise it will be [returned_value_if_false]<br/><br/>[any_variable] - String, date, boolean or number - as a variable contains any value<br/>[user_target] - String, date, boolean or number - as a value or variable contains any value<br/><br/>Examples:<br/>iff(3==3, 1, 2)  - in this case result of 3==3 expression is true and the system returns 1<br/>iff(3==4, 1, 2)  - in this case result of 3==4 expression is false and the system returns 2<br/>iff(maturity_price==0, 'set maturity price!', 'maturity price is setted') - in this case the system compare value in variable with name maturity_price and a) if it is 0 returns string 'set maturity price!' b) if it is not 0 returns string  'maturity price is setted'<br/>iff(maturity_date==now(), maturity_price , 0) - in this case the system compare date in variable with name maturity_date and a) if they are equal returns number in variable with name [maturity_price] b) otherwise returns 0<br/>iff(price]target_price, 0) - in this case the system compare date in variable with name maturity_date and a) if they are equal returns number in variable with name [maturity_price] b) otherwise returns 0<br/>iff(5]4, 1, 2)  - in this case result of 5]4 expression is true and the system returns 1 (you can use not only == in expression, but also [ and ])<br/>",
			"groups": "condit",
			"func": "iff([any_variable]==[user_target], [returned_value_if_true], [returned_value_if_false])",
			"validation": {
				"func": "iff([any_variable]==[user_target], [returned_value_if_true], [returned_value_if_false])"
			}
		},
		{
			"name": "Convert any value to string (date, number, boolean)",
			"description": "str([value]) :: [Result: string]<br/><br/>[Result: String]: String - text converted from any variable of other class (date, number, boolean). For example, 2018-01-01 as a date object gets converted to '2018-01-01' as a text data. This function is used to convert any non-text variables to text for writing it to any text variables. For example user wants to auto-write transaction date (as a date object in variable [transaction_date] to the text object in variable [notes] - he can use expression str(transaction_date) <br/><br/>[value] - any value or variable used by user in this expression<br/><br/>Examples:<br/>str('abcde') for getting data as a text object abcde<br/>str(transaction_date) for getting data as a text object which is contained in date variable with name [transaction_date]<br/>str(now()) for getting current date as a string<br/>str(coupon_size) for getting data as a text object which is contained in number variable with name [coupon_size]<br/>str(compare_result) for getting data as a text object which is contained in boolean variable with name [compare_result]",
			"groups": "text",
			"func": "str([value])",
			"validation": {
				"func": "str([value])"
			}
		},
		{
			"name": "Get text with upper letters",
			"description": "upper([string]) :: [Result: String]<br/><br/>[Result: String]: String - the same text (string) with upper letters<br/>[string]: String - any string or string variable, used by user in this expression<br/><br/>Examples:<br/>upper(notes) for getting the same string as written in string variable with name [notes] but with upper letters<br/>upper('abcd') for getting the same string with upper letters (ABCD)",
			"groups": "text",
			"func": "upper([string])",
			"validation": {
				"func": "upper([string])"
			}
		},
		{
			"name": "Get text with lower letters",
			"description": "lower([string]) :: [Result: String]<br/><br/>[Result: String]:String - the same text (string) with lower letters<br/>[string]: String - any string or string variable, used by user in this expression<br/><br/>Examples:<br/>lower(user_text_1) for getting the same string as written in string variable with name [(user_text_1] but with lower letters<br/>lower('EFGH') for getting the same string with lower letters (efgh)",
			"groups": "text",
			"func": "lower([string])",
			"validation": {
				"func": "lower([string])"
			}
		},
		{
			"name": "Compare two strings (does one contain the other)",
			"description": "contains([string1], [string2]) :: [Result: contain_boolean]<br/><br/>[Result: contain_boolean]: Boolean - True or False. If [string1] contains [string2] so result of this function is 'True', otherwise the result is 'False'. This function can be used as a parameter of other functions, for example user can check if notes (as an attribute of instrument or transaction) contain any important info. <br/><br/>[string1], [string2]: String - any string or string variable, used by user in this expression<br/><br/>Examples:<br/>contains('CDABEF','AB') - the result is boolean 'True'<br/>contains('CDEF','AB') - the result is boolean 'False'<br/>contains(instrument,'swap') - the result is boolean 'True' (if name of instrument in variable with such name contains string 'swap') or 'False'<br/>",
			"groups": "text",
			"func": "contains([string1],[string2])",
			"validation": {
				"func": "contains([string1],[string2])"
			}
		},

		{
			"name": "Replace",
			"description": "replace([string1],[oldValue],[newValue]) :: [Result: string1]<br/><br/>",
			"groups": "text",
			"func": "replace([string1],[oldValue],[newValue])",
			"validation": {
				"func": "replace([string1],[oldValue],[newValue])"
			}
		},
		{
			"name": "Get Coupon Size",
			"description": "get_instrument_coupon([instr], [effective_date]) :: [Result: coupon_size]<br/>[Result: coupon_size]: Number - coupon size for 1 quantity of the [instr] as of the [effective_date] as per the [instr] Accrual Schedule<br/><br/>[instr]: Instrument - instrument for which the coupon is calculated<br/>[effective_date]: Date - as of date for the coupon calculation<br/><br/>Examples:<br/>get_instrument_coupon(instrument, trade_date)<br/>get_instrument_coupon(instrument, '2019-01-01')<br/><br/>! if  [effective_date] doesn't equal to any coupon date of the instrument (as per the Accrual Schedule), then [Result: coupon_size] equal to 0",
			"groups": "instr_formulas",
			"func": "get_instrument_coupon([instr], [effective_date])",
			"validation": {
				"func": "get_instrument_coupon([instr], [effective_date])"
			}
		},
		{
			"name": "Get Accruals Size",
			"description": "get_instrument_accrued_price([instr], [trade_date]) :: [Result: accrued_price]<br/>[Result: accrued_price]: Number - accrued price (part of the total price of trade) for 1 quantity of the [instr] as of the [trade_date]<br/><br/>[instr]: Instrument - instrument for which the accrued price is calculated<br/>[trade_date]: Date - as of date for the accrued price calculation (usually trade date or settlement date) - date variable or date as a string object in format 'YY-mm-dd'<br/><br/>Examples:<br/>get_instrument_accrued_price(instrument, trade_date)<br/>get_instrument_accrued_price(instrument, '2019-01-01')<br/><br/>! if  user or system didn't set coupon size of the instrument (Settings for instrument), then [Result: accrued_price] equal to 0",
			"groups": "instr_formulas",
			"func": "get_instrument_accrued_price([instr], [trade_date])",
			"validation": {
				"func": "get_instrument_accrued_price([instr], [trade_date])"
			}
		},
		{
			"name": "Calculate Linear Price",
			"description": "simple_price([date], [date1], [price1], [date2], [price2]) :: [Result: simple_price]<br/><br/>[Result: simple_price]: Number - linear price for a date [date] within a date range ([date1] and [date2]) with known prices ([price1] for [date1] and [price2] for [date2]). <br/><br/>[date1],[date2]: Date - any date variable used by user in this expression (eg, transaction_date, maturity_date) or a date as a text (string) in format 'YY-mm-dd'<br/>[price1],[price2]: Number - any numbers or number variables used in system<br/><br/>Examples:<br/>simple_price('2018-01-02', '2018-01-01', 10, '2018-01-03', 20) - to get linear price for date between two dates (2018-01-02 and 2018-01-03) with these prices (10 and 20). The result in this case = 15<br/><br/>simple_price('2018-09-01', transaction_date, price, maturity_date, maturity_price)  - to get linear price for date 2018-09-01 based on prices written in variables with names [price] (for transaction_date) and [maturity_price] (for maturity_date)",
			"groups": "instr_formulas",
			"func": "simple_price([date], [date1], [price1], [date2], [price2])",
			"validation": {
				"func": "simple_price([date], [date1], [price1], [date2], [price2])"
			}
		},
		{
			"name": "Pricing currency user code",
			"description": "[instrument].pricing_currency.user_code: Text - unique user code for instrument pricing currency<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.pricing_currency.user_code - if name of variable is [instrument]<br/>instr.pricing_currency.user_code  - if name of variable is [instr]",
			"groups": "instr",
			"func": ".pricing_currency.user_code",
			"validation": {
				"func": "[instrument].pricing_currency.user_code"
			}
		},
		{
			"name": "Pricing currency name",
			"description": "[instrument].pricing_currency.name: Text - name for instrument pricing currency<br/><br/>[instrument] - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.pricing_currency.name - if name of variable is [instrument]<br/>instr.accrued_currency.name  - if name of variable is [instr]",
			"groups": "instr",
			"func": ".pricing_currency.name",
			"validation": {
				"func": "[instrument].pricing_currency.name"
			}
		},
		{
			"name": "Accrued currency user code",
			"description": "[instrument].accrued_currency.user_code: Text - unique user code for instrument accrued currency<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.accrued_currency.user_code - if name of variable is [instrument]<br/>instr.accrued_currency.name  - if name of variable is [instr]",
			"groups": "instr",
			"func": ".accrued_currency.user_code",
			"validation": {
				"func": "[instrument].accrued_currency.user_code"
			}
		},
		{
			"name": "Accrued currency name",
			"description": "[instrument].accrued_currency.name: Text - name for instrument accrued currency<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples: <br/>instrument.accrued_currency.name - if name of variable is [instrument]<br/>instr.accrued_currency.name  - if name of variable is [instr]",
			"groups": "instr",
			"func": ".accrued_currency.name",
			"validation": {
				"func": "[instrument].accrued_currency.name"
			}
		},
		{
			"name": "Reference for pricing",
			"description": "[instrument].reference_for_pricing: Text - system reference for pricing for instrument, used in downloading prices from external providers<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions. For example for bond instrument YPF SOCIEDAD ANONIMA  3.75%  30-Sep-2019 (with user_code CH0336352825 - it's ISIN) result  of instrument.reference_for_pricing is 'CH0336352825 Corp' - code used in downloading prices from external providers<br/><br/>Examples: <br/>instrument.reference_for_pricing - if name of variable is [instrument]<br/>instr.reference_for_pricing - if name of variable is [instr]",
			"groups": "instr",
			"func": ".reference_for_pricing",
			"validation": {
				"func": "[instrument].reference_for_pricing"
			}
		},
		{
			"name": "Price multiplier",
			"description": "[instrument].price_multiplier: Number - multiplier applied for the Instrument price when valuing the Instrument. For example, for bonds which are priced as % of notional, the  price_multiplier should be  0.01<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples:<br/>instrument.price_multiplier<br/>instr.price_multiplier<br/><br/>! If this parameter was not specified in Instrument settings then result equal to 1",
			"groups": "instr",
			"func": ".price_multiplier",
			"validation": {
				"func": "[instrument].price_multiplier"
			}
		},
		{
			"name": "Accrued price multiplier",
			"description": "[instrument].accrued_multiplier: Number  - multiplier applied for the Instrument accrued price<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples:<br/>instrument.accrued_multiplier<br/>instr.accrued_multiplier<br/><br/>! If this parameter was not specified in Instrument settings then result equal to 1",
			"groups": "instr",
			"func": ".accrued_multiplier",
			"validation": {
				"func": "[instrument].accrued_multiplier"
			}
		},
		{
			"name": "Maturity date",
			"description": "[instrument].maturity_date: Date - date of maturity (redemption) of the instrument. Maturity date allows user and system to create maturity transaction at this date and prompt the user to book it automatically<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples:<br/>instrument.maturity_date<br/>instr.maturity_date",
			"groups": "instr",
			"func": ".maturity_date",
			"validation": {
				"func": "[instrument].maturity_date"
			}
		},
		{
			"name": "Maturity price",
			"description": "[instrument].maturity_price: Number - price of maturity (redemption) of the instrument, this parameter can be used in transaction types for instruments maturity<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples:<br/>instrument.maturity_price<br/>instr.maturity_price<br/><br/>! If this parameter was not specified in Instrument settings then result equal to 0",
			"groups": "instr",
			"func": ".maturity_price",
			"validation": {
				"func": "[instrument].maturity_price"
			}
		},
		{
			"name": "Default price",
			"description": "[instrument].default_price: Number - default price of instrument, it ca у used in cases when current prices for the instrument are unavailable<br/><br/>[instrument]: Instrument - variable contains instrument (instrument unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (instrument) via these functions<br/><br/>Examples:<br/>instrument.default_price<br/>instr.default_price<br/><br/>! If this parameter was not specified in Instrument settings then result equal to 0",
			"groups": "instr",
			"func": ".default_price",
			"validation": {
				"func": "[instrument].default_price"
			}
		},
		{
			"name": "Public name",
			"description": "[account].public_name: Text - system public name for account shown when the user has no rights to see it`s real name<br/><br/>[account]: Account - variable contains account (account unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (account) via these functions<br/><br/>Examples: <br/>account.public_name - if name of variable is [account]<br/>acc.public_name - if name of variable is [acc]",
			"groups": "account",
			"func": ".public_name",
			"validation": {
				"func": "[account].public_name"
			}
		},
		{
			"name": "Name",
			"description": "[currency].name: Text - name for currency<br/><br/>[currency]: Currency - variable contains currency  (currency unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (currency) via these functions<br/><br/>Examples: <br/>currency.name - if name of variable is [currency]<br/>tr_currency.name  - if name of variable is [tr_currency]",
			"groups": "currency",
			"func": ".name",
			"validation": {
				"func": "[currency].name"
			}
		},
		{
			"name": "Reference FX rate",
			"description": "[currency].reference_for_pricing: Text - system reference for pricing for currency (for pair currency-USD), used in downloading rates from external providers<br/><br/>[currency]: Currency - variable contains currency (currency unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (currency) via these functions. For example for swiss franc (with user_code CHF) result  of currency.reference_for_pricing is 'CHFUSD Curncy' - code used in downloading rates  from external providers<br/><br/>Examples: <br/>currency.reference_for_pricing - if name of variable is [currency]<br/>ccy_deal.reference_for_pricing - if name of variable is [ccy_deal]",
			"groups": "currency",
			"func": ".reference_for_pricing",
			"validation": {
				"func": "[currency].reference_for_pricing"
			}
		},
		{
			"name": "User code",
			"description": "[currency].user_code: Text - system unique user code for currency<br/><br/>[currency]: Currency - variable contains currency (currency unique user code) defined by user in scheme, transaction type - user can address to the attributes of this object/entity (currency) via these functions<br/><br/>Examples: <br/>currency.user_code - if name of variable is [currency]<br/>ccy.user_code - if name of variable is [ccy]",
			"groups": "currency",
			"func": ".user_code",
			"validation": {
				"func": "[currency].user_code"
			}
		},
		{
			"name": "Instrument user code",
			"description": "transactions[0].instrument.user_code: Text - system unique user code for instrument<br/>",
			"groups": "transact_des",
			"func": "transactions[0].instrument.user_code",
			"validation": {
				"func": "transactions[0].instrument.user_code"
			}
		},
		{
			"name": "Instrument name",
			"description": "transactions[0].instrument.name: Text - system name for instrument",
			"groups": "transact_des",
			"func": "transactions[0].instrument.name",
			"validation": {
				"func": "transactions[0].instrument.name"
			}
		},
		{
			"name": "Instrument short name",
			"description": "transactions[0].instrument.short_name: Text - short name for instrument<br/> <br/>",
			"groups": "transact_des",
			"func": "transactions[0].instrument.short_name",
			"validation": {
				"func": "transactions[0].instrument.short_name"
			}
		},
		{
			"name": "Instrument maturity date",
			"description": "transactions[0].instrument.maturity_date: Date - maturity date for instrument<br/>",
			"groups": "transact_des",
			"func": "transactions[0].instrument.maturity_date",
			"validation": {
				"func": "transactions[0].instrument.maturity_date"
			}
		},
		{
			"name": "Portfolio user code",
			"description": "transactions[0].portfolio.user_code: Text - system unique user code for portfolio",
			"groups": "transact_des",
			"func": "transactions[0].portfolio.user_code",
			"validation": {
				"func": "transactions[0].portfolio.user_code"
			}
		},
		{
			"name": "Portfolio name",
			"description": "transactions[0].portfolio.name: Text - name for portfolio",
			"groups": "transact_des",
			"func": "transactions[0].portfolio.name",
			"validation": {
				"func": "transactions[0].portfolio.name"
			}
		},
		{
			"name": "Portfolio short name",
			"description": "transactions[0].portfolio.short_name: Text - short name for portfolio",
			"groups": "transact_des",
			"func": "transactions[0].portfolio.short_name",
			"validation": {
				"func": "transactions[0].portfolio.short_name"
			}
		},
		{
			"name": "Account cash user code",
			"description": "transactions[0].account_cash.user_code: Text - system unique user code for account cash",
			"groups": "transact_des",
			"func": "transactions[0].account_cash.user_code",
			"validation": {
				"func": "transactions[0].account_cash.user_code"
			}
		},
		{
			"name": "Account cash name",
			"description": "transactions[0].account_cash.name: Text - name for account cash",
			"groups": "transact_des",
			"func": "transactions[0].account_cash.name",
			"validation": {
				"func": "transactions[0].account_cash.name"
			}
		},
		{
			"name": "Account cash short name",
			"description": "transactions[0].account_cash.short_name: Text - short name for account cash<br/>",
			"groups": "transact_des",
			"func": "transactions[0].account_cash.short_name",
			"validation": {
				"func": "transactions[0].account_cash.short_name"
			}
		},
		{
			"name": "Account cash public name",
			"description": "transactions[0].account_cash.public_name: Text - public name for account cash",
			"groups": "transact_des",
			"func": "transactions[0].account_cash.public_name",
			"validation": {
				"func": "transactions[0].account_cash.public_name"
			}
		},
		{
			"name": "Account position user code",
			"description": "transactions[0].account_cash.user_code: Text - system unique user code for account position",
			"groups": "transact_des",
			"func": "transactions[0].account_position.user_code",
			"validation": {
				"func": "transactions[0].account_position.user_code"
			}
		},
		{
			"name": "Account position name",
			"description": "transactions[0].account_cash.name: Text - name for account position",
			"groups": "transact_des",
			"func": "transactions[0].account_position.name",
			"validation": {
				"func": "transactions[0].account_position.name"
			}
		},
		{
			"name": "Account position short name",
			"description": "transactions[0].account_cash.short_name: Text - short name for account position<br/>",
			"groups": "transact_des",
			"func": "transactions[0].account_position.short_name",
			"validation": {
				"func": "transactions[0].account_position.short_name"
			}
		},
		{
			"name": "Account position public name",
			"description": "transactions[0].account_cash.public_name: Text - public name for account position",
			"groups": "transact_des",
			"func": "transactions[0].account_position.public_name",
			"validation": {
				"func": "transactions[0].account_position.public_name"
			}
		},
		{
			"name": "Account interim user code",
			"description": "transactions[0].account_cash.user_code: Text - system unique user code for account interim",
			"groups": "transact_des",
			"func": "transactions[0].account_interim.user_code",
			"validation": {
				"func": "transactions[0].account_interim.user_code"
			}
		},
		{
			"name": "Account interim name",
			"description": "transactions[0].account_cash.name: Text - name for account interim",
			"groups": "transact_des",
			"func": "transactions[0].account_interim.name",
			"validation": {
				"func": "transactions[0].account_interim.name"
			}
		},
		{
			"name": "Account interim short name",
			"description": "transactions[0].account_cash.short_name: Text - short name for account interim<br/>",
			"groups": "transact_des",
			"func": "transactions[0].account_interim.short_name",
			"validation": {
				"func": "transactions[0].account_interim.short_name"
			}
		},
		{
			"name": "Account interim public name",
			"description": "transactions[0].account_cash.public_name: Text - public name for account interim",
			"groups": "transact_des",
			"func": "transactions[0].account_interim.public_name",
			"validation": {
				"func": "transactions[0].account_interim.public_name"
			}
		},
		{
			"name": "Counterparty user code",
			"description": "transactions[0].counterparty.user_code: Text - system unique user code for counterparty",
			"groups": "transact_des",
			"func": "transactions[0].counterparty.user_code",
			"validation": {
				"func": "transactions[0].counterparty.user_code"
			}
		},
		{
			"name": "Counterparty name",
			"description": "transactions[0].counterparty.name: Text - name for counterparty",
			"groups": "transact_des",
			"func": "transactions[0].counterparty.name",
			"validation": {
				"func": "transactions[0].counterparty.name"
			}
		},
		{
			"name": "Counterparty short name",
			"description": "transactions[0].counterparty.short_name: Text - short name for counterparty",
			"groups": "transact_des",
			"func": "transactions[0].counterparty.short_name",
			"validation": {
				"func": "transactions[0].counterparty.short_name"
			}
		},
		{
			"name": "Responsible user code",
			"description": "transactions[0].responsible.user_code: Text - system unique user code for responsible",
			"groups": "transact_des",
			"func": "transactions[0].responsible.user_code",
			"validation": {
				"func": "transactions[0].responsible.user_code"
			}
		},
		{
			"name": "Responsible name",
			"description": "transactions[0].responsible.name: Text - name for responsible",
			"groups": "transact_des",
			"func": "transactions[0].responsible.name",
			"validation": {
				"func": "transactions[0].responsible.name"
			}
		},
		{
			"name": "Responsible short name",
			"description": "transactions[0].responsible.short_name: Text - short name for responsible",
			"groups": "transact_des",
			"func": "transactions[0].responsible.short_name",
			"validation": {
				"func": "transactions[0].responsible.short_name"
			}
		},
		{
			"name": "Accounting (trade) date",
			"description": "transactions[0].accounting_date: Date - accounting (trade) date for transaction",
			"groups": "transact_des",
			"func": "transactions[0].accounting_date",
			"validation": {
				"func": "transactions[0].accounting_date"
			}
		},
		{
			"name": "Cash (settlement) date",
			"description": "transactions[0].cash_date: Date - cash (settlement) date for transaction",
			"groups": "transact_des",
			"func": "transactions[0].cash_date",
			"validation": {
				"func": "transactions[0].cash_date"
			}
		},
		{
			"name": "Notes",
			"description": "transactions[0].notes: Text - notes for transaction",
			"groups": "transact_des",
			"func": "transactions[0].notes",
			"validation": {
				"func": "transactions[0].notes"
			}
		},
		{
			"name": "Position",
			"description": "transactions[0].position_size_with_sign: Number - position size with sign (change of position as the result of transaction)",
			"groups": "transact_des",
			"func": "transactions[0].position_size_with_sign",
			"validation": {
				"func": "transactions[0].position_size_with_sign"
			}
		},
		{
			"name": "Principal",
			"description": "transactions[0].principal_with_sign: Number - principal size with sign (change of principal as the result of transaction)<br/>",
			"groups": "transact_des",
			"func": "transactions[0].principal_with_sign",
			"validation": {
				"func": "transactions[0].principal_with_sign"
			}
		},
		{
			"name": "Carry (accrued)",
			"description": "transactions[0].carry_with_sign: Number - carry (accrued) with sign (change of carry (accrued) as the result of transaction)<br/>",
			"groups": "transact_des",
			"func": "transactions[0].carry_with_sign",
			"validation": {
				"func": "transactions[0].carry_with_sign"
			}
		},
		{
			"name": "Overheads (commission)",
			"description": "transactions[0].overheads_with_sign: Number - overheads with sign (commission)",
			"groups": "transact_des",
			"func": "transactions[0].overheads_with_sign",
			"validation": {
				"func": "transactions[0].overheads_with_sign"
			}
		},
		{
			"name": "Cash consideration",
			"description": "transactions[0].cash_consideration: Number - cash consideration with sign (change of cash as the result of transaction)",
			"groups": "transact_des",
			"func": "transactions[0].cash_consideration",
			"validation": {
				"func": "transactions[0].cash_consideration"
			}
		},
		{
			"name": "Transaction currency name",
			"description": "transactions[0].transaction_currency.name: Text - name for transaction currency",
			"groups": "transact_des",
			"func": "transactions[0].transaction_currency.name",
			"validation": {
				"func": "transactions[0].transaction_currency.name"
			}
		},
		{
			"name": "Transaction currency user code",
			"description": "transactions[0].transaction_currency.user_code: Text - system unique user code for transaction currency",
			"groups": "transact_des",
			"func": "transactions[0].transaction_currency.user_code",
			"validation": {
				"func": "transactions[0].transaction_currency.user_code"
			}
		},
		{
			"name": "Settlement currency name",
			"description": "transactions[0].settlement_currency.name: Text - name for settlement currency",
			"groups": "transact_des",
			"func": "transactions[0].settlement_currency.name",
			"validation": {
				"func": "transactions[0].settlement_currency.name"
			}
		},
		{
			"name": "Settlement currency user code",
			"description": "transactions[0].settlement_currency.user_code: Text - system unique user code for settlement currency",
			"groups": "transact_des",
			"func": "transactions[0].settlement_currency.user_code",
			"validation": {
				"func": "transactions[0].settlement_currency.user_code"
			}
		},
		{
			"name": "Date",
			"description": "any date in format 'YY-mm-dd' , whereas dd - day, mm - month, yy - year with century",
			"groups": "data_types",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Number",
			"description": "any number in format  ### (integer) and ###.### (float number with decimals). Don`t use other format, eg ###,### or ###-### or ### ###",
			"groups": "data_types",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Text",
			"description": "any sequence of symbols, max 256 symbols. String should start and end with apostrophe (') or ditto-mark (')",
			"groups": "data_types",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Arrays",
			"description": "List of the objacts having same Data Type. The elements of the n-th element of the list is referred as: List[n]<br/>The numeration alwas starts from [0]<br/><br/>For Example:<br/>transaction[0], transaction[1]",
			"groups": "data_types",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Boolean (Logical)",
			"description": "boolean parameter - 'true' of 'false' in computer format (not as a string!). It can be used by the system or user in his expressions as a parameter of complicated functions",
			"groups": "data_types",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Position",
			"description": "[position] :: [Result: [position]]<br/><br/>[Result: [position]]:  Number - number variable autofilled from context, in this case context is an event generated by the system for instrument with predefined events in settings. Each event contains user code of instrument - then the system check in which portfolios and accounts this instrument is detected on the date of event - and what is the position of this instrument. And this position is transmitted from context variable to user`s variable [position] used in transaction type for event transaction<br/><br/>[position]: Number - any position variable, used by user in this expression<br/><br/>Examples:<br/>[position]<br/>[pos]<br/>[pos_coupon_event]",
			"groups": "context_var",
			"func": "position",
			"validation": {
				"func": "position"
			}
		},
		{
			"name": "Instrument",
			"description": "[instrument/instr] :: [Result: [instrument]]<br/><br/>[Result: [instrument]]:  Instrument - variable of Instrument type autofilled from context, in this case context is an event  generated by the system for instrument with predefined events in settings. Each event contains user code of instrument. And this user code is transmitted from context variable to user`s variable [instrument] <br/><br/>[instr]: Instrument - any instrument variable, used by user in this expression<br/><br/>Examples:<br/>[instrument]<br/>[instr]<br/>[instrument_coupon_event]<br/>[instrument_maturity]",
			"groups": "context_var",
			"func": "instrument",
			"validation": {
				"func": "instrument"
			}
		},
		{
			"name": "Portfolio",
			"description": "[portfolio/portf] :: [Result: [portfolio]]<br/><br/>[Result: [portfolio]]:  Portfolio - portfolio variable autofilled from context, in this case context is an event generated by the system for instrument with predefined events in settings. Each event contains user code of instrument - then the system check in which portfolios and accounts this instrument is detected on the date of event. And portfolios (it`s user code) with instrument in it is transmitted from context variable to user`s variable [portfolio] used in transaction type for event transaction<br/><br/>[portfolio]: Portfolio - any portfolio variable, used by user in this expression<br/><br/>Examples:<br/>[portfolio]<br/>[prt]<br/>[prt_coupon_event]",
			"groups": "context_var",
			"func": "portfolio",
			"validation": {
				"func": "portfolio"
			}
		},
		{
			"name": "Account",
			"description": "[account/acc] :: [Result: [account]]<br/><br/>[Result: [account]]:  Account - account variable autofilled from context, in this case context is an event generated by the system for instrument with predefined events in settings. Each event contains user code of instrument - then the system check in which portfolios and accounts this instrument is detected on the date of event. And account with instrument is transmitted from context variable to user`s variable [account] used in transaction type for event transaction<br/><br/>[account]: Account - any account variable, used by user in this expression<br/><br/>Examples:<br/>[account]<br/>[acc]<br/>[acc_coupon_event]",
			"groups": "context_var",
			"func": "account",
			"validation": {
				"func": "account"
			}
		},
		{
			"name": "Accruals Currency",
			"description": "[accrued_currency] :: [Result: [currency]]<br/><br/>[Result: [currency]]:  Currency - account variable autofilled from context, in this case context is an event generated by the system for instrument with predefined events in settings. Each instrument has the parameter accrued_currency. And this parameter is transmitted from context variable to user`s variable [currency] used in transaction type for event transaction<br/><br/>[currency]: Currency - any currency variable, used by user in this expression<br/><br/>Examples:<br/>[currency]<br/>[ccy]",
			"groups": "context_var",
			"func": "accrued_currency",
			"validation": {
				"func": "accrued_currency"
			}
		},
		{
			"name": "Effective Date",
			"description": "[effective_date] :: [Result: [effective_date]]<br/><br/>[Result: [effective_date]]:  Effective_date - variable autofilled from context, in this case context is an event generated by the system for instrument with predefined events in settings. Events are generated on a specific date according to a schedule of events (for example, a coupon payment schedule) created in the settings of each instrument. And this date is transmitted from context variable to user`s variable [effective_date] used in transaction type for event transaction<br/><br/>[effective_date]: Date  - any date variable, used by user in this expression<br/><br/>Examples:<br/>[effective_date]<br/>[e_date]<br/>[coupon_date]",
			"groups": "context_var",
			"func": "effective_date",
			"validation": {
				"func": "effective_date"
			}
		},
		{
			"name": "Notification date",
			"description": "[notification_date] :: [Result: [notification_date]]<br/><br/>[Result: [notification_date]]:  Notification date - variable autofilled from context, in this case context is an event (notification) generated by the system for instrument with predefined events in settings.  Date of notification (according to settings of notification for each instrument) is transmitted from context variable to user`s variable [notification_date] used in transaction type for event transaction<br/><br/>[notification_date]: Date  - any date variable, used by user in this expression<br/><br/>Examples:<br/>[notification_date]<br/>[not_date]",
			"groups": "context_var",
			"func": "notification_date",
			"validation": {
				"func": "notification_date"
			}
		},
		{
			"name": "Convert String to Number",
			"description": "float([string]) :: [Result: number_from_string]<br/><br/>[Result: number_from_string]: Number - number converted from string. For example, '10' gets converted to 10 as a number data, and '13.999' gets converted to 13.999. This function is used to convert any string variables (for example notes, where user can wrote numbers, but for the system it is still string data)<br/><br/>[string] - any string or string variable, used by user in this expression<br/><br/>Examples:<br/>int('25') for getting data as a number object 25<br/>float('25.09') for getting data as a number object 25.09<br/>int(notes) for getting data as a number object from string variable with name [notes]<br/>float(notes) for getting data as a number object from string variable with name [notes]",
			"groups": "number",
			"func": "float([string])",
			"validation": {
				"func": "float([string])"
			}
		},
		{
			"name": "Convert Date to String",
			"description": "format_date([date], [format]='%Y-%m-%d') :: [Result: formatted date]<br/><br/>[Result: formatted date]: String - [date] is converted into String as per the specified format [format]<br/><br/>[date]:Date - date to convert<br/>[format]:String - date specification of the date format (see Date/Formats)",
			"groups": "date",
			"func": "format_date([date], [format]='%Y-%m-%d')",
			"validation": {
				"func": "format_date([date], [format]='%Y-%m-%d')"
			}
		},
		{
			"name": "Formats",
			"description": "The following reserved combinations of the symbols are used in Date formatting either to parse date or to convert Date variable to String <br/><br/>%a  : Weekday as locale’s abbreviated name. (Ex: Mon)<br/>%A  : Weekday as locale’s full name. (Ex: Monday)<br/>%d  : Day of the month as zero-padded. (Ex: 02)<br/>%b  : Month as locale’s abbreviated name. (Ex: Sep)<br/>%B  : Month as locale’s full name. (Ex: September)<br/>%m  : Month as a number as zero-padded. (Ex: 09)<br/>%y  : Year without century number. (Ex: 13)<br/>%Y  : Year with century number. (Ex: 2013)<br/>%j  : Day of the year as zero-padded. (Ex: 005)<br/>%W  : Week number of the year. All days [ first Monday are considered to be in week 0. (Ex: 39)<br/>%w   :  Weekday as a decimal number, where 0 is Sunday and 6 is Saturday - 0, 1, ..., 6<br/>%x  : Locale’s appropriate date representation. (Ex: 9/30/2018)",
			"groups": "date",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Language Operators",
			"description": "Numeric operators: +, -, / (division), *, % (mod)<br/>Text concatenation: +<br/>Date operators: <Date> + days(<n days>)<br/>Variable Parameters:  instrument.price_multiplier , instrument['price_multiplier'], context['instrument']['price_multiplier']<br/>Comparison: ==, !=, >, >=, <, <=<br/>If operator:  iif(<expression>,<value if true>,<value if false>)",
			"groups": "",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Language Basics",
			"description": "The Expressions Language syntax resembles syntax of Python. For ease of compiling Expressions one can use Notepad++ freeware which applies colour scheme to the text and helps in writing complex Expressions.<br/><br/>Function description:   function_name(arg1, arg2=<default value for arg>)<br/>Data types: see Data Types tab",
			"groups": "",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "contains(a,b)",
			"description": "contains(a,b)",
			"groups": "text",
			"func": "contains(a,b)",
			"validation": {
				"func": "contains(a,b)"
			}
		},
		{
			"name": "date(year, month=1, day=1)",
			"description": "date(year, month=1, day=1)",
			"groups": "date",
			"func": "date(year, month=1, day=1)",
			"validation": {
				"func": "date(year, month=1, day=1)"
			}
		},
		{
			"name": "timedelta(years=0, months=0, days=0, leapdays=0, weeks=0)",
			"description": "timedelta(years=0, months=0, days=0, leapdays=0, weeks=0)<br/>general timedelta creation<br/><br/>   years, months, weeks, days:<br/>       Relative information, may be negative (argument is plural); adding<br/>       or subtracting a relativedelta with relative information performs<br/>       the corresponding aritmetic operation on the original datetime value<br/>       with the information in the relativedelta.<br/>   leapdays:<br/>       Will add given days to the date found, if year is a leap<br/>       year, and the date found is post 28 of february",
			"groups": "date",
			"func": "timedelta(years=0, months=0, days=0, leapdays=0, weeks=0)",
			"validation": {
				"func": "timedelta(years=0, months=0, days=0, leapdays=0, weeks=0)"
			}
		},
		{
			"name": "add_weeks(date, days)",
			"description": "add_weeks(date, days) same as d + days(x * 7)",
			"groups": "date",
			"func": "add_weeks(date, days)",
			"validation": {
				"func": "add_weeks(date, days)"
			}
		},
		{
			"name": "format_number",
			"description": "format_number(number, decimal_sep='.', decimal_pos=None, grouping=3, thousand_sep='', use_grouping=False)<br/>format float number<br/><br/>   decimal_sep:<br/>       Decimal separator symbol (for example '.')<br/>   decimal_pos:<br/>       Number of decimal positions<br/>   grouping:<br/>       Number of digits in every group limited by thousand separator<br/>   thousand_sep:<br/>       Thousand separator symbol (for example ',')<br/>   use_grouping:<br/>       use thousand separator",
			"groups": "number",
			"func": "format_number(number, decimal_sep='.', decimal_pos=None, grouping=3, thousand_sep='', use_grouping=False)",
			"validation": {
				"func": "format_number(number, decimal_sep='.', decimal_pos=None, grouping=3, thousand_sep='', use_grouping=False)"
			}
		},
		{
			"name": "simple_price(date, date1, value1, date2, value2)",
			"description": "simple_price(date, date1, value1, date2, value2)<br/>   calculate price on date using 2 point (date1, value1) and (date2, value2)<br/><br/><br/>if dates is string then that try parse use '%Y-%m-%d'",
			"groups": "pricing",
			"func": "simple_price(date, date1, value1, date2, value2)",
			"validation": {
				"func": "simple_price(date, date1, value1, date2, value2)"
			}
		},
		{
			"name": "dynamic attributes ",
			"description": "dynamic attributes (in future releases):<br/>       value_string: str - used for string type<br/>       value_float: float - used for number type<br/>       value_date: date - used for date type<br/>       classifier: null - used for classifier type<br/>           name: str<br/>           level: int<br/>           parent: recursive classifier data",
			"groups": "user_attr",
			"func": "dynamic attributes ",
			"validation": {
				"func": "dynamic attributes "
			}
		},
		{
			"name": "With Text",
			"description": "The most common issues:<br/>1. make sure that in text expression all summands are text variables or cinverte to text (if date/number)",
			"groups": "issues",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "With Dates",
			"description": "0",
			"groups": "issues",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Strategy 2",
			"description": "[strategy2] :: [Result: Strategy]<br/><br/>[Result: Strategy]:  Strategy - variable autofilled from the Context (see Context Variables / Context).  The variable stores the Strategy 2 of the selected Context.",
			"groups": "context_var",
			"func": "strategy2",
			"validation": {
				"func": "strategy2"
			}
		},
		{
			"name": "Strategy 3",
			"description": "[strategy3] :: [Result: Strategy]<br/><br/>[Result: Strategy]:  Strategy - variable autofilled from the Context (see Context Variables / Context).  The variable stores the Strategy 3 of the selected Context.",
			"groups": "context_var",
			"func": "strategy3",
			"validation": {
				"func": "strategy3"
			}
		},
		{
			"name": "Context",
			"description": "The notion of Context appears in the following situations:<br/> 1. When some Instrument on the balance triggers an Event and this Event should be booked automatically, the Context means which Instrument, in which Portfolio, on which Account, which Strategy, having Position, on which Date etc. has triggered the Event. Context here is the set of parameters using which one understands all the details on the source of the Event<br/> 2. When one tries to book a Transaction there is a place from which he has clicked the button to book the transaction. In this case the  Context contains the available information on this location. For example, if users was viewing an Instrument in the Entity Viewer and decided to book a Transactions with this Instrument, the Context would contain an information on the Instrument which the user has been viewing. ",
			"groups": "context_var",
			"func": " ",
			"validation": {
				"func": " "
			}
		},
		{
			"name": "Get Transaction type default input",
			"description": "get_ttype_default_input([input])) :: [Result: default input]<br/><br/>[input]: String - input name<br/>[Result: default input]: String, number, date or entity - as a default input of transaction type<br/><br/>Examples:<br/>get_ttype_default_input('price')<br/>get_ttype_default_input('currency')<br/>get_ttype_default_input('currency').user_code - attribute [user_code] of default currency<br/>get_ttype_default_input('maturity_date')<br/>get_ttype_default_input('notes')",
			"groups": "transaction",
			"func": "get_ttype_default_input([input])",
			"validation": {
				"func": "get_ttype_default_input([input])"
			}
		},
		{
			"name": "Set Complex Transaction input",
			"description": "set_complex_transaction_input([input], [value])) :: [Result: None]<br/><br/>[input]: String - input name<br/>[Result: default input]: String, number, date or entity - as a default input of transaction type<br/><br/>Examples:<br/>get_ttype_default_input('price')<br/>get_ttype_default_input('currency')<br/>get_ttype_default_input('currency').user_code - attribute [user_code] of default currency<br/>get_ttype_default_input('maturity_date')<br/>get_ttype_default_input('notes')",
			"groups": "transaction",
			"func": "set_complex_transaction_input([input], [value])",
			"validation": {
				"func": "set_complex_transaction_input([input], [value])"
			}
		},
		{
			"name": "Set Complex Transaction User Field",
			"description": "set_complex_transaction_user_field([field_key], [value])) :: [Result: None]<br/><br/>[input]: String - field key name<br/>[Result: default input]: String, number, date or entity - as a default input of transaction type<br/><br/>Examples:<br/>get_ttype_default_input('price')<br/>get_ttype_default_input('currency')<br/>get_ttype_default_input('currency').user_code - attribute [user_code] of default currency<br/>get_ttype_default_input('maturity_date')<br/>get_ttype_default_input('notes')",
			"groups": "transaction",
			"func": "set_complex_transaction_user_field([field_key], [value])",
			"validation": {
				"func": "set_complex_transaction_user_field([field_key], [value])"
			}
		},
		{
			"name": "Set Complex Transaction Form Data",
			"description": "set_complex_transaction_form_data([key], [value])) :: [Result: None]<br/><br/>[key]: String - input name<br/>[Result: default input]: String, number, date or entity - as a default input of transaction type<br/><br/>Examples:<br/>get_ttype_default_input('price')<br/>get_ttype_default_input('currency')<br/>get_ttype_default_input('currency').user_code - attribute [user_code] of default currency<br/>get_ttype_default_input('maturity_date')<br/>get_ttype_default_input('notes')",
			"groups": "transaction",
			"func": "set_complex_transaction_form_data([key], [value])",
			"validation": {
				"func": "set_complex_transaction_form_data([key], [value])"
			}
		},
		{
			"name": "Get relation by user code",
			"description": "get_relation_by_user_code([content_type], [user_code])) :: [Result: relation object]<br/><br/>[content_type]: String - input name<br/>[user_code]: String - relation user code<br/>[[Result: relation object]: String, number, date or entity<br/><br/>Examples:<br/>get_relation_by_user_code('currencies.currency', 'USD')<br/>get_relation_by_user_code('instruments.instrumenttype', 'bonds')<br/>get_relation_by_user_code('currencies.currency', 'USD').user_code - attribute [user_code]",
			"groups": "transaction",
			"func": "get_relation_by_user_code([content_type], [user_code])",
			"validation": {
				"func": "get_relation_by_user_code([content_type], [user_code])"
			}
		},
		{
			"name": "Calculate accrued",
			"description": "calculate_accrued([instrument], [date])) :: [Result: number]",
			"groups": "transaction",
			"func": "calculate_accrued([instrument], [date])",
			"validation": {
				"func": "calculate_accrued([instrument], [date])"
			}
		},
		{
			"name": "Add FX rate",
			"description": "add_fx_history([date], [currency], [pricing_policy], [fx_rate], [Overwrite]) :: [Result: FX rate on specified date added to the system]<br/><br/>[Result: rate]: Number - FX rate of currency on specified date and policy<br/>[date]: Date - needed date contained in variable or text (for exapmle tr_date or '2019-01-01')<br/>[currency]: Text - user_code of currency contained in variable or text (for exapmle tr_currency or 'GBP')<br/>[policy]: Text - pricing policy (user_code) for calculation contained in variable or text (for example pr_policy or 'default')<br/>[fx_rate]: - Number - needed result of function - added FX rate on specified date contained in variable or text (for example tr_fx_rate or 1, 1.3, 0.76)<br/>[Overwrite]: Boolean - parameter for overwriting mode if fx rate on specified date already exists (for example true or false, true by default)<br/><br/>Examples:<br/>add_fx_history('2019-12-31', 'GBP', 'default', 2, true) - function to add rate of GBP to USD on 2019-12-31 used in default pricing policy, if rate already exists it will be overwritten<br/>add_fx_history('2019-12-31', 'GBP', 'default', 2) - the same example, rate will be overwritten bc true-parameter is used by default<br/>add_fx_history(tr_date, tr_currency, 'default', tr_fx_rate) - function to add rate of currency on transaction date used in default pricing policy which are contained in used variables (tr_date, tr_currency and tr_fx_rate)<br/><br/>",
			"groups": "number",
			"func": "add_fx_history([date], [currency], [pricing_policy], [fx_rate], [Overwrite])",
			"validation": {
				"func": "add_fx_history([date], [currency], [pricing_policy], [fx_rate], [Overwrite])"
			}
		},
		{
			"name": "Get FX rate",
			"description": "get_fx_rate([date], [currency], [pricing_policy], [Default]) :: [Result: FX rate on specified date]<br/><br/>[Result: FX rate]: Number - FX rate of currency on specified date and policy saved in the system<br/>[date]: Date - needed date contained in variable or text (for exapmle tr_date or '2019-01-01')<br/>[currency]: Text - user_code of currency contained in variable or text (for exapmle tr_currency or 'GBP')<br/>[policy]: Text - pricing policy (user_code) for calculation contained in variable or text (for example pr_policy or 'default')<br/>[Default]: - Number - default FX rate returned in case of missed FX history for needed currency in the system (for example tr_fx_rate or 1, 1.3, 0.76)<br/><br/>Examples:<br/>get_fx_rate('2019-12-31', 'GBP', 'default', 1.3) - function to get rate of GBP to USD on 2019-12-31 saved in the system for default pricing policy<br/>get_fx_rate(tr_date, tr_currency, 'default', tr_fx_rate) - function to get rate of currency on transaction date (for default pricing policy) which are contained in used variables (tr_date, tr_currency), if it is missed the function will returns rate saved in variable [tr_fx_rate]",
			"groups": "number",
			"func": "get_fx_rate([date], [currency], [pricing_policy], [Default])",
			"validation": {
				"func": "get_fx_rate([date], [currency], [pricing_policy], [Default])"
			}
		},
		{
			"name": "Add price history",
			"description": "add_price_history([date], [instrument], [pricing_policy], [principal_price], [accrued_price], [Overwrite]) :: [Result: Principal and accrued price of instrument on specified date added to the system]<br/><br/>[Result: Price]: Numbers - Principal and accrued price of instrument on specified date and policy<br/>[date]: Date - needed date contained in variable or text (for exapmle tr_date or '2019-01-01')<br/>[instrument]: Text - user_code of instrument contained in variable or text (for exapmle tr_instrument or 'XS784567239')<br/>[policy]: Text - pricing policy (user_code) for calculation contained in variable or text (for example pr_policy or 'default')<br/>[principal_price], [accrued_price]: - Numbers - needed result of function - added price (principal and accrued parts) on specified date contained in variable or text (for example tr_principal and tr_accrued or 99.5 and 0.07)<br/>[Overwrite]: Boolean - parameter for overwriting mode if price on specified date already exists (for example true or false, true by default)<br/><br/>Examples:<br/>add_price_history('2019-12-31', 'XS784567239', 'default', 99.5, 0.07, true) - function to add price of instrument (with user code XS784567239) on 2019-12-31 used in default pricing policy, if price already exists it will be overwritten<br/>add_price_history('2019-12-31', 'XS784567239', 'default', 99.5, 0.07) - the same example, price will be overwritten bc true-parameter is used by default<br/>add_price_history(tr_date, instrument, 'default', tr_principal, tr_accrued) - function to add instrument price on transaction date used in default pricing policy which are contained in used variables (tr_date, instrument, tr_principal and tr_accrued)<br/><br/>",
			"groups": "number",
			"func": "add_price_history([date], [instrument], [pricing_policy], [principal_price], [accrued_price], [Overwrite])",
			"validation": {
				"func": "add_price_history([date], [instrument], [pricing_policy], [principal_price], [accrued_price], [Overwrite])"
			}
		},
		{
			"name": "Get instrument factor",
			"description": "get_factor([date], [instrument], [Default]) :: [Result: instrument factor on specified date]<br/><br/>[Result: instrument factor]: Number - instrument factor on specified date saved in the system<br/>[date]: Date - needed date contained in variable or text (for example tr_date or '2019-01-01')<br/>[instrument]: Text - user_code of instrument contained in variable or text (for exapmle tr_instrument or 'T-Bills_2027')<br/>[Default]: - Number - default factor returned in case of no factor history for needed instrument in the system (for example tr_factor or 1, 0.5)<br/><br/>Examples:<br/>get_factor('2019-12-31', 'T-Bills_2027', 1) - function to get factor of instrument (with user code T-Bills_2027) on 2019-12-31 saved in the system, if it is no factor for instrument on this date the function will return 1<br/>get_factor(tr_date, tr_instrument, tr_factor) - function to get instrument factor on transaction date which are contained in used variables (tr_date, tr_instrument), if it is missed the function will return factor saved in variable [tr_factor]",
			"groups": "number",
			"func": "get_factor([date], [instrument], [Default])",
			"validation": {
				"func": "get_factor([date], [instrument], [Default])"
			}
		},
		{
			"name": "Replace default value if null",
			"description": "if_null([input], [default_value]): [Result: value in input or default value for this input (if input is empty)]<br/><br/>[Result: Not-null input value]: Number, text or date that can be used in import of transactions or instruments<br/>[input] - Input used in import of transactions or instruments - column or field imported from file or provider<br/>[default_value] - value used in case of empty input<br/><br/>Examples:<br/>if_null(transaction_date,  '01/01/2019') - the system will use value in input [transaction_date] or fixed date if it is empty<br/>if_null(accrued_currency,  'USD') - the system will use value in input [accrued_currency] or fixed user code of currency if it is empty<br/>if_null(price,  100) - 100 will be used in case of empty input [price]<br/>if_null(RTG_FITCH, 'CCC') - CCC will be used in case of empty field [RTG_FITCH] imported from provider for instrument",
			"groups": "condit",
			"func": "if_null([input], [value if null])",
			"validation": {
				"func": "if_null([input], [value if null])"
			}
		},
		{
			"name": "Less / Equal or less",
			"description": "[number1]<=[number2] :: [Result: boolean]<br/>[date1]<=[date2] :: [Result: boolean]<br/><br/>[Result: boolean]: Boolean - true or false as a system parameter which can be used in any function<br/>[number1], [number2]: Number - number or variable contains number<br/>[date1], [date2]: Date - date or variable contains date in system format<br/><br/>Examples: <br/>[number1]<=[number2] for number variable with names number1 and number2, it returns [true] if number1 equal or less than number2 ([false] otherwise)<br/>iff([number1]<=[number2], 'number1 is equal or less!', 'number2 is greater!') returns the text with the result of the comparison numer1 and number2<br/>iff(90<=transaction_price, transaction_price, 90) returns of the comparison price in variable [transaction_price] and 90 as a target price - if transaction price less than such target price this function returns target price (ie 90)<br/>iff(accounting_date<=now(), accounting_date, now()) returns of the comparison transaction date in variable [accounting_date] and current date - if transaction date less than current date this function returns transaction date (ie current date)",
			"groups": "logic",
			"func": "[number1]<=[number2][date1]<=[date2]",
			"validation": {
				"func": "[number1]<=[number2][date1]<=[date2]"
			}
		},
		{
			"name": "Greater / Equal or greater",
			"description": "[number1]=>[number2] :: [Result: boolean]<br/>[date1]=>[date2] :: [Result: boolean]<br/><br/>[Result: boolean]: Boolean - true or false as a system parameter which can be used in any function<br/>[number1], [number2]: Number - number or variable contains number<br/>[date1], [date2]: Date - date or variable contains date in system format<br/><br/>Examples: <br/>[number1]=>[number2] for number variable with names number1 and number2, it returns [true] if number1 equal or greater than number2 ([false] otherwise)<br/>iff([number1]=>[number2], 'number1 is equal or greater!', 'number2 is less!') returns the text with the result of the comparison numer1 and number2<br/>iff(90=>transaction_price, transaction_price, maturity_price) returns of the comparison price in variable [transaction_price] and 90 as a target price - if transaction price less than such target price this function returns transaction price (ie price in variable [maturity_price ])<br/>iff(accounting_date=>'2018-01-01', accounting_date, '2018-01-01') returns of the comparison transaction date in variable [accounting_date] and 2018-01-01 - if transaction date equal or greater than target date this function returns transaction date (ie target date 2018-01-01)",
			"groups": "logic",
			"func": "[number1]=>[number2][date1]=>[date2]",
			"validation": {
				"func": "[number1]=>[number2][date1]=>[date2]"
			}
		},
		{
			"name": "Get the latest principal price of instrument",
			"description": "get_latest_principal_price([date-from], [date-to], [instrument], [policy], [default_value]): [Result: number in system format]<br/><br/><br/><br/>[Result: number in system format]: Number in system format - number that can be used in system calculations<br/>[date-from] - Date contained in variable or text (for example book_date or '2019-01-01')<br/>[date-to] - Date contained in variable or text (for example maturity_date or '2019-12-31')<br/>[instrument] - Instrument (user code of instrument) contained in variable or text (for example instrument or 'XS765432100US')<br/>[default_value] - number contained in variable or text (for example default_price or '100')<br/><br/>Examples:<br/><br/>get_latest_principal_price('2019-01-01', '2019-12-31', 'UC11', '-', 99) - to get latest principal price (in the period from 2019-01-01 to 2019-12-31) of instrument with user code UC11, price should be under default pricing policy ('-'), in case of clear pricing history this function will return 99<br/>get_latest_principal_price(issue_date, book_date, instrument, book_policy, default_price) - to get latest principal price (the period = dates in variables [issue_date] and [book_date]) user code of instrument is in variable [instrument], pricing policy is in variable [book_policy], in case of clear pricing history this function will return number in variable [default_price]<br/>",
			"groups": "number",
			"func": "get_latest_principal_price([date-from],[date-to],[instrument], [policy], [default_value])",
			"validation": {
				"func": "get_latest_principal_price([date-from],[date-to],[instrument], [policy], [default_value])"
			}
		},
		{
			"name": "Operator AND",
			"description": "[condition_1] and [condition_2]: [Result: execution of expression if both conditions are met]<br/>[condition_1], [condition_2] - Any condition written in expression language (for example price==1, position=!0)<br/><br/>Examples:<br/>price==1 and position=!0 - action will be executed if both conditions are met - variable [price] contains 1 and variable [position] contains 0<br/>transaction_date==now() and account=!'Equities' - action will be executed if both conditions are met - variable [transaction_date] contains current date and variable [account] contains 'Equities'",
			"groups": "logic",
			"func": "[condition_1] and [condition_2]",
			"validation": {
				"func": "[condition_1] and [condition_2]"
			}
		},
		{
			"name": "Operator OR",
			"description": "[condition_1] or [condition_2]: [Result: execution of expression if at least one condition is met]<br/>[condition_1], [condition_2] - Any condition written in expression language (for example price==1, position=!0)<br/><br/>Examples:<br/>price==1 and position=!0 - action will be executed if one or both conditions are met - variable [price] contains 1 or variable [position] contains 0<br/>transaction_date==now() or account=!'Equities' - action will be executed if variable [transaction_date] contains current date or variable [account] contains 'Equities'",
			"groups": "logic",
			"func": "[condition_1] or [condition_2]",
			"validation": {
				"func": "[condition_1] or [condition_2]"
			}
		},
		{
			"name": "Operator NOT",
			"description": "[condition_1] and not [condition_2]: [Result: execution of expression if one condition is met and other is not met]<br/>[condition_1], [condition_2] - Any condition written in expression language (for example price==1, position=!0)<br/><br/>Examples:<br/>price==1 and not position==0 - action will be executed if variable [price] contains 1 and variable [position] doesn`t contain 0<br/>transaction_date==now() and not account=!'Equities' - action will be executed if variable [transaction_date] contains current date, but variable [account] doesn`t contain 'Equities'",
			"groups": "logic",
			"func": "[condition_1] and not [condition_2]",
			"validation": {
				"func": "[condition_1] and not [condition_2]"
			}
		},
		{
			"name": "Set instrument field",
			"description": "set_instrument_field( [instrumentID], [parameter_name], [parameter_value]): [Result: action - setting of instrument field]<br/>[Result: action - setting of instrument field]: Filled parameter (attribute) of instrument (for example short name, default price, maturity date etc)<br/>[instrumentID] - Instrument (user code of instrument) contained in variable or text (for example instrument or 'XS765432100US')<br/>[parameter_name] - parameter of instrument contained in variable or text (for example param_var or 'default_price')<br/>[parameter_value] - number, text or date contained in variable or text (for example trans_price or 100)<br/><br/>Examples:<br/><br/>set_instrument_field('XS123456900', 'default_price', 100) - to set default price (100) of instrument with user code XS123456900<br/>set_instrument_field(instrument, default_price, def_pr) - to set parameter (in variable [default_price]) of instrument (in variable [default_price]), value is in variable [def_pr])",
			"groups": "instr",
			"func": "set_instrument_field( [instrumentID], [parameter_name], [parameter_value])",
			"validation": {
				"func": "set_instrument_field( [instrumentID], [parameter_name], [parameter_value])"
			}
		},
		{
			"name": "Set currency field",
			"description": "set_currency_field([currencyID], [parameter_name], [parameter_value]): [Result: action - setting of currency field]<br/>[Result: action - setting of currency field]: Filled parameter (attribute) of currency (for example short name, default rate etc)<br/>[currencyID] - currency (user code of currency) contained in variable or text (for example tr_currency or 'AUD')<br/>[parameter_name] - parameter of currency contained in variable or text (for example param_var or 'default_fx_rate')<br/>[parameter_value] - number, text or date contained in variable or text (for example trans_rate or 1)<br/><br/>Examples:<br/><br/>set_currency_field('AUD', 'default_fx_rate', 1) - to set default fx rate (1) of currency with user code AUD<br/>set_currency_field(tr_currency, def_param, def_pr) - to set parameter (in variable [def_param]) of currency (in variable [tr_currency]), value is in variable [def_pr])",
			"groups": "currency",
			"func": "set_currency_field([currencyID], [parameter_name], [parameter_value])",
			"validation": {
				"func": "set_currency_field([currencyID], [parameter_name], [parameter_value])"
			}
		},
		{
			"name": "Get instrument field",
			"description": "get_instrument_field( [instrumentID], [parameter_name): [Result: Value of instrument field]<br/>[Result: value of instrument field]: Number, date or text in parameter (attribute) of instrument (for example short name, default price, maturity date etc)<br/>[instrumentID] - Instrument (user code of instrument) contained in variable or text (for example instrument or 'XS765432100US')<br/>[parameter_name] - parameter of instrument contained in variable or text (for example param_var or 'default_price')<br/><br/>Examples:<br/><br/>get_instrument_field('XS123456900', 'default_price') - to get default price of instrument with user code XS123456900<br/>get_instrument_field(instrument, default_price) - to get parameter (in variable [default_price]) of instrument (in variable [instrument])",
			"groups": "instr",
			"func": "get_instrument_field( [instrumentID], [parameter_name])",
			"validation": {
				"func": "get_instrument_field( [instrumentID], [parameter_name])"
			}
		},
		{
			"name": "Get currency field",
			"description": "get_currency_field([currencyID], [parameter_name]): [Result: value of currency field]<br/>[Result: value of currency field]: Number, date or text in parameter (attribute) of currency (for example short name, default rate etc)<br/>[currencyID] - currency (user code of currency) contained in variable or text (for example tr_currency or 'AUD')<br/>[parameter_name] - parameter of currency contained in variable or text (for example param_var or 'default_fx_rate')<br/><br/>Examples:<br/><br/>get_currency_field('AUD', 'default_fx_rate') - to get default fx rate of currency with user code AUD<br/>get_currency_field(tr_currency, def_param) - to get parameter (in variable [def_param]) of currency (in variable [tr_currency])",
			"groups": "currency",
			"func": "get_currency_field([currencyID], [parameter_name])",
			"validation": {
				"func": "get_currency_field([currencyID], [parameter_name])"
			}
		},
		{
			"name": "Get Instrument accrual size",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instr_accrual_size()",
			"validation": {
				"func": "get_instr_accrual_size()"
			}
		},
		{
			"name": "Get Instrument accrual factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instr_accrual_factor()",
			"validation": {
				"func": "get_instr_accrual_factor()"
			}
		},
		{
			"name": "Get Instrument accrual price",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instr_accrued_price()",
			"validation": {
				"func": "get_instr_accrued_price()"
			}
		},
		{
			"name": "Get Instrument factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instr_factor()",
			"validation": {
				"func": "get_instr_factor()"
			}
		},
		{
			"name": "Get Instrument coupon factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instr_coupon_factor()",
			"validation": {
				"func": "get_instr_coupon_factor()"
			}
		},
		{
			"name": "Get Instrument coupon",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instr_coupon()",
			"validation": {
				"func": "get_instr_coupon()"
			}
		},
		{
			"name": "Format Date",
			"description": "TBD",
			"groups": "date",
			"func": "format_date2()",
			"validation": {
				"func": "format_date2()"
			}
		},
		{
			"name": "Parse Date",
			"description": "TBD",
			"groups": "date",
			"func": "parse_date2()",
			"validation": {
				"func": "parse_date2()"
			}
		},
		{
			"name": "Get Date last month end business",
			"description": "TBD",
			"groups": "date",
			"func": "get_date_last_month_end_business()",
			"validation": {
				"func": "get_date_last_month_end_business()"
			}
		},
		{
			"name": "Get Date last quarter end business",
			"description": "TBD",
			"groups": "date",
			"func": "get_date_last_quarter_end_business()",
			"validation": {
				"func": "get_date_last_quarter_end_business()"
			}
		},
		{
			"name": "Get Date last year end business",
			"description": "TBD",
			"groups": "date",
			"func": "get_date_last_year_end_business()",
			"validation": {
				"func": "get_date_last_year_end_business()"
			}
		},
		{
			"name": "Get next coupon date",
			"description": "TBD",
			"groups": "instr",
			"func": "get_next_coupon_date()",
			"validation": {
				"func": "get_next_coupon_date()"
			}
		},
		{
			"name": "Generate User code",
			"description": "TBD",
			"groups": "text",
			"func": "generate_user_code()",
			"validation": {
				"func": "generate_user_code()"
			}
		},
		{
			"name": "Get rt value",
			"description": "TBD",
			"groups": "text",
			"func": "get_rt_value()",
			"validation": {
				"func": "get_rt_value()"
			}
		},
		{
			"name": "Add days",
			"description": "TBD",
			"groups": "date",
			"func": "add_days()",
			"validation": {
				"func": "add_days()"
			}
		},
		{
			"name": "Add FX History",
			"description": "TBD",
			"groups": "fx_rates",
			"func": "add_FXHistory()",
			"validation": {
				"func": "add_FXHistory()"
			}
		},
		{
			"name": "Add Price History",
			"description": "TBD",
			"groups": "prices",
			"func": "add_PriceHistory()",
			"validation": {
				"func": "add_PriceHistory()"
			}
		},
		{
			"name": "Get Date group",
			"description": "TBD",
			"groups": "date",
			"func": "date_group()",
			"validation": {
				"func": "date_group()"
			}
		},
		{
			"name": "Get Date max",
			"description": "TBD",
			"groups": "date",
			"func": "date_max()",
			"validation": {
				"func": "date_max()"
			}
		},
		{
			"name": "Get Date min",
			"description": "TBD",
			"groups": "date",
			"func": "date_min()",
			"validation": {
				"func": "date_min()"
			}
		},
		{
			"name": "Find Name",
			"description": "TBD",
			"groups": "text",
			"func": "find_name()",
			"validation": {
				"func": "find_name()"
			}
		},
		{
			"name": "Generate User Code",
			"description": "TBD",
			"groups": "text",
			"func": "generateUserCode()",
			"validation": {
				"func": "generateUserCode()"
			}
		},
		{
			"name": "get_AccruedPrice",
			"description": "TBD",
			"groups": "prices",
			"func": "get_AccruedPrice()",
			"validation": {
				"func": "get_AccruedPrice()"
			}
		},
		{
			"name": "Get Factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_Factor()",
			"validation": {
				"func": "get_Factor()"
			}
		},
		{
			"name": "Get FX Rate",
			"description": "TBD",
			"groups": "fx_rates",
			"func": "get_FXRate()",
			"validation": {
				"func": "get_FXRate()"
			}
		},
		{
			"name": "Get Instrument accrual factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instrument_accrual_factor()",
			"validation": {
				"func": "get_instrument_accrual_factor()"
			}
		},
		{
			"name": "Get Instrument accrual size",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instrument_accrual_size()",
			"validation": {
				"func": "get_instrument_accrual_size()"
			}
		},
		{
			"name": "Get Instrument coupon factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instrument_coupon_factor()",
			"validation": {
				"func": "get_instrument_coupon_factor()"
			}
		},
		{
			"name": "Get Instrument factor",
			"description": "TBD",
			"groups": "instr",
			"func": "get_instrument_factor()",
			"validation": {
				"func": "get_instrument_factor()"
			}
		},
		{
			"name": "Get Principal Price",
			"description": "TBD",
			"groups": "prices",
			"func": "get_PrincipalPrice()",
			"validation": {
				"func": "get_PrincipalPrice()"
			}
		},
		{
			"name": "Get variable",
			"description": "TBD",
			"groups": "context_var",
			"func": "get_var()",
			"validation": {
				"func": "get_var()"
			}
		},
		{
			"name": "Has variable",
			"description": "TBD",
			"groups": "context_var",
			"func": "has_var()",
			"validation": {
				"func": "has_var()"
			}
		},
		{
			"name": "Is leap",
			"description": "TBD",
			"groups": "date",
			"func": "isleap()",
			"validation": {
				"func": "isleap()"
			}
		},
		{
			"name": "Len",
			"description": "TBD",
			"groups": "text",
			"func": "len()",
			"validation": {
				"func": "len()"
			}
		},
		{
			"name": "Months",
			"description": "TBD",
			"groups": "date",
			"func": "months()",
			"validation": {
				"func": "months()"
			}
		},
		{
			"name": "Parse Number",
			"description": "TBD",
			"groups": "number",
			"func": "parse_number()",
			"validation": {
				"func": "parse_number()"
			}
		},
		{
			"name": "Range",
			"description": "TBD",
			"groups": "number",
			"func": "range()",
			"validation": {
				"func": "range()"
			}
		},
		{
			"name": "Simple group",
			"description": "TBD",
			"groups": "text",
			"func": "simple_group()",
			"validation": {
				"func": "simple_group()"
			}
		},
		{
			"name": "Weeks",
			"description": "TBD",
			"groups": "date",
			"func": "weeks()",
			"validation": {
				"func": "weeks()"
			}
		},
		{
			"name": "Substr",
			"description": "TBD",
			"groups": "text",
			"func": "substr()",
			"validation": {
				"func": "substr()"
			}
		},
		{
			"name": "Reg search",
			"description": "TBD",
			"groups": "text",
			"func": "reg_search()",
			"validation": {
				"func": "reg_search()"
			}
		},
		{
			"name": "Reg replace",
			"description": "TBD",
			"groups": "text",
			"func": "reg_replace()",
			"validation": {
				"func": "reg_replace()"
			}
		},
		{
			"name": "Bool",
			"description": "TBD",
			"groups": "logic",
			"func": "bool()",
			"validation": {
				"func": "bool()"
			}
		},
		{
			"name": "Get default portfolio",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_portfolio()",
			"validation": {
				"func": "get_default_portfolio()"
			}
		},
		{
			"name": "Get default instrument",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_instrument()",
			"validation": {
				"func": "get_default_instrument()"
			}
		},
		{
			"name": "Get default account",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_account()",
			"validation": {
				"func": "get_default_account()"
			}
		},
		{
			"name": "Get default currency",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_currency()",
			"validation": {
				"func": "get_default_currency()"
			}
		},
		{
			"name": "Get default transaction type",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_transaction_type()",
			"validation": {
				"func": "get_default_transaction_type()"
			}
		},
		{
			"name": "Get default instrument type",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_instrument_type()",
			"validation": {
				"func": "get_default_instrument_type()"
			}
		},
		{
			"name": "Get default account type",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_account_type()",
			"validation": {
				"func": "get_default_account_type()"
			}
		},
		{
			"name": "Get default pricing policy",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_pricing_policy()",
			"validation": {
				"func": "get_default_pricing_policy()"
			}
		},
		{
			"name": "Get default responsible",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_responsible()",
			"validation": {
				"func": "get_default_responsible()"
			}
		},
		{
			"name": "Get default counterparty",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_counterparty()",
			"validation": {
				"func": "get_default_counterparty()"
			}
		},
		{
			"name": "Get default strategy1",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_strategy1()",
			"validation": {
				"func": "get_default_strategy1()"
			}
		},
		{
			"name": "Get default strategy2",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_strategy2()",
			"validation": {
				"func": "get_default_strategy2()"
			}
		},
		{
			"name": "Get default strategy3",
			"description": "TBD",
			"groups": "transaction",
			"func": "get_default_strategy3()",
			"validation": {
				"func": "get_default_strategy3()"
			}
		}
	];

    module.exports = {
        functionsItems: functionsItems,
    }

}());