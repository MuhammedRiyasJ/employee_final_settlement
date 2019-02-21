from __future__ import unicode_literals
import frappe, erpnext
import frappe.defaults
from frappe.utils import cint, flt
from frappe import _, msgprint, throw
from frappe.model.mapper import get_mapped_doc
from erpnext.hr.doctype.leave_application.leave_application \
	import get_leave_allocation_records, get_leave_balance_on, get_approved_leaves_for_period

@frappe.whitelist()
def get_data(employee='',test=''):
	leaves_taken = frappe.db.sql("""select sum(total_leave_days) from `tabLeave Application` where employee=%s and docstatus=1""",(employee))[0]
	try:
		basic_salary = frappe.db.sql("""select base,variable from `tabSalary Structure Assignment` where employee=%s and docstatus=1""",(employee))[0]
		return {'total_leaves_taken':leaves_taken[0],'basic_salary':basic_salary[0],'variable_salary':basic_salary[1]}
	except IndexError:
		pass