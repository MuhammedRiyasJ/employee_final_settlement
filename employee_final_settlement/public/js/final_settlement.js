cur_frm.add_fetch("employee", "date_of_joining", "joining_date");
frappe.ui.form.on("Employee Final Settlement", {
	reason_for_end_of_service: function(frm) {
	var basic_salary = frm.doc.basic_salary;
    var daily_wage = basic_salary/30;
    var yearly_grty = daily_wage*21;
    var grty_perday = yearly_grty/365;
    var date = frappe.datetime.get_day_diff(frm.doc.ending_date, frm.doc.joining_date )
    var total_grty = grty_perday*date;
    var for_three = total_grty/3;
    var leave_salary = daily_wage * frm.doc.total_leaves_taken;
	if (frm.doc.contract_type == "Limited") {
		if (date<=365) {
			frm.set_value("gratuity_payable", 0);
			frm.set_value("leave_salary", 0);
		}
		else if (date>365 && date<=1825) {
			frm.set_value("gratuity_payable", total_grty);
			frm.set_value("leave_salary", leave_salary);
		}
		else if (date>=1825){
			var for_over_five = daily_wage/365;
    		var for_over_five_grty = for_over_five*date;
			frm.set_value("gratuity_payable", for_over_five_grty);
			frm.set_value("leave_salary", leave_salary);
		}
	}
	else if (frm.doc.contract_type == "Unlimited") {
		if (frm.doc.reason_for_end_of_service == "Termination") {
			if (date<=365) {
			frm.set_value("gratuity_payable", 0);
			frm.set_value("leave_salary", 0);
			}
			else if (date>365 && date<=1825) {
				frm.set_value("gratuity_payable", total_grty);
				frm.set_value("leave_salary", leave_salary);
			}
			else if (date>=1825){
				var for_over_five = daily_wage/365;
	    		var for_over_five_grty = for_over_five*date;
				frm.set_value("gratuity_payable", for_over_five_grty);
				frm.set_value("leave_salary", leave_salary);
			}
		}
		else if (frm.doc.reason_for_end_of_service == "Resignation") {
			if (date<=365) {
				frm.set_value("gratuity_payable", 0);
				frm.set_value("leave_salary", 0);
			}
			else if (date>365 && date<=1095) {
				frm.set_value("gratuity_payable", for_three);
				frm.set_value("leave_salary", leave_salary);
			}
			else if (date>1095 && date<=1825){
				var for_five = for_three*2;
				frm.set_value("gratuity_payable", for_five);
				frm.set_value("leave_salary", leave_salary);
			}
			else if (date>1825) {
				frm.set_value("gratuity_payable", total_grty);
				frm.set_value("leave_salary", leave_salary);
			}
		}
	}
	var salary_payable = basic_salary + frm.doc.variable_salary;
	frm.set_value("leave_salary", leave_salary);
	
},
employee:function(frm){
                frappe.call({
                        method: "employee_final_settlement.employee_final_settlement.final_settlement.get_data",
                        args: {
                                  "employee": frm.doc.employee,

                        },
                        callback: function(r) { 
                                
                                
                                frm.set_value("basic_salary",r.message.basic_salary);
                                frm.set_value("variable_salary",r.message.variable_salary);

                        } 
                });
        },
 ending_date:function(frm){
                var date = frappe.datetime.get_day_diff(frm.doc.ending_date, frm.doc.joining_date )
                frm.set_value("service_period", date);
        },
validate:function(frm){
		var total_amount_addition = 0;
		$.each(frm.doc.addition || [], function(i, d) {
			total_amount_addition += flt(d.amount);
		});
		var total_amount_deduction = 0;
		$.each(frm.doc.deduction || [], function(i, d) {
			total_amount_deduction += flt(d.amount);
		});
		var net_total = flt(frm.doc.gratuity_payable) + flt(frm.doc.leave_salary) + flt(frm.doc.salary_payable) + flt(total_amount_addition) - flt(total_amount_deduction);
		frm.set_value("net_total", net_total);
},

});
