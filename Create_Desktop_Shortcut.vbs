Set WshShell = CreateObject("WScript.Shell")

' Target OneDrive Desktop
Set link1 = WshShell.CreateShortcut("C:\Users\surra\OneDrive\Desktop\BillMaster App.lnk")
link1.TargetPath = "C:\TT\project\Run_BillMaster_App.bat"
link1.WorkingDirectory = "C:\TT\project"
link1.WindowStyle = 1
link1.Description = "Launch BillMaster Java Full Stack App"
link1.Save

' Target Local Desktop
On Error Resume Next
Set link2 = WshShell.CreateShortcut("C:\Users\surra\Desktop\BillMaster App.lnk")
link2.TargetPath = "C:\TT\project\Run_BillMaster_App.bat"
link2.WorkingDirectory = "C:\TT\project"
link2.WindowStyle = 1
link2.Description = "Launch BillMaster Java Full Stack App"
link2.Save

WScript.Echo "Shortcuts created on Desktop!"
