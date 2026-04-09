try:
    import pymysql
    # Satisfy Django 2.2.1+ requirement for mysqlclient version
    pymysql.version_info = (2, 2, 8, "final", 0)
    pymysql.install_as_MySQLdb()
except ImportError:
    pass